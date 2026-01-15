import { Injectable } from '@nestjs/common';
import { Product, UserAgent } from '@prisma/client';
import { StateGraph } from '@langchain/langgraph';
import { LLMPlatform, RAGState, RAGStateAnnotation } from 'src/model/Rag.model';
import { START, END } from '@langchain/langgraph';
import { ChoosenLLmService } from '../service/ChoosenLLm.service';
import { ChatMemoryRedisService } from '../ChatMemoryRedis.service';
import { VectorStoreService } from 'src/module/vector/service/vectoreStore.service';
import { XenovaEmbeddings } from 'src/module/embedding/service/xenovaEmbbeding.service';
import { PrismaService } from 'src/module/prisma/service/prisma.service';
import { RAGService } from '../service/RAG.service';
import { OpenAiEmbbedingService } from 'src/module/embedding/service/openAIEmbedding.service';

@Injectable()
export class CustomerServiceWorkFlow {
  constructor(
    private readonly choosenLLmService: ChoosenLLmService,
    private ragService: RAGService,
    private readonly vectorStoreService: VectorStoreService,
    private readonly embeddingService: XenovaEmbeddings,
    private readonly openAiEmbbedingService: OpenAiEmbbedingService,
    private prismaService: PrismaService,
    private chatMemory: ChatMemoryRedisService,
  ) {}

  async workflow(agent: UserAgent, question: string, sessionId: string) {
    const llm = await this.choosenLLmService.chooseLLM(
      agent.llm,
      agent.model,
      agent.apiKey,
    );

    if (!llm) return;

    const graph = new StateGraph(RAGStateAnnotation)
      .addNode('classify', (s) => this.ragService.classifyIntent(s, llm))
      .addNode('retrieve', (s) => this.ragService.Retrieve(s, agent))
      .addNode('product', (s) => this.product(s, agent, llm))
      .addNode('orders', (s) => this.order(s, agent))
      .addNode('humanHandle', (s) => this.humanHandle(s, agent, sessionId))
      .addNode('generate', (s) => this.ragService.Generate(s, agent, llm));

    graph.addEdge(START, 'classify');
    graph.addConditionalEdges('classify', this.condtionalStagesProduct);
    graph.addConditionalEdges('retrieve', this.condtionalStages);
    graph.addEdge('product', 'generate');
    graph.addEdge('orders', 'humanHandle');
    graph.addEdge('humanHandle', 'generate');
    graph.addEdge('generate', END);

    const app = graph.compile();
    const history = await this.chatMemory.getHistory(sessionId);
    const result = await app.invoke({
      question,
      chatHistory: [...history, { role: 'customer', content: question }],
    });

    await this.chatMemory.appendMessage(sessionId, {
      role: 'customer',
      content: question,
    });

    await this.chatMemory.appendMessage(sessionId, {
      role: 'assistant',
      content: result.answer,
    });

    return result.answer;
  }

  async product(state: RAGState, agent: UserAgent, llm: LLMPlatform) {
    const category = `
      - PRODUCT SINGLE (ONE SPESIFIC PRODUCT)
      - PRODUCT LIST (MULTIPLE SPESIFIC PRODUCT)
      - PRODUCT ALL (ALL PRODUCT)
    `;
    const res = await this.ragService.classifyTools(
      state.question,
      llm,
      category,
    );

    const collection = 'AgentUserProduct';
    const baseFilter = {
      must: [{ key: 'userId', match: { value: agent.userId } }],
    };

    // Product All

    if (res === 'PRODUCT ALL') {
      const results = await this.vectorStoreService.searchByFilter(
        collection,
        baseFilter,
      );

      const productIds = results?.points?.map((r) =>
        String(r.payload?.productId),
      );

      const data = await this.prismaService.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const productSerialiase = await this.productSerialiase(data);

      return {
        products: productSerialiase,
      };
    }

    // Product Single or List

    // const embedding = await this.embeddingService.embedQuery(state.question);
    const embedding = await this.openAiEmbbedingService.embedQuery(
      state.question,
    );

    if (!embedding) return;

    const results = await this.vectorStoreService.similaritySearch(
      embedding,
      collection,
      baseFilter,
      3,
    );

    const productIds = results?.map((r) => String(r.payload?.productId)) || [];

    if (productIds.length !== 0) {
      const data = await this.prismaService.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const productSerialiase = await this.productSerialiase(data);

      return {
        products: productSerialiase,
      };
    }
  }

  async order(state: RAGState, agent: UserAgent) {
    return {
      order:
        'Klien sekarang siap untuk melakukan pemesanan ANSWER = Terima kasih, kami akan mengalihkan Anda ke Customer Service. asli kami!!',
    };
  }
  async humanHandle(state: RAGState, agent: UserAgent, sessionId: string) {
    const data = await this.prismaService.conversation.findFirst({
      where: {
        room: sessionId,
      },
    });

    if (!data) return;

    await this.prismaService.conversation.update({
      where: {
        id: data?.id,
      },
      data: {
        humanHandle: true,
      },
    });
  }

  async condtionalStages(state: RAGState) {
    let stage = '';
    switch (state.intent) {
      case 'ORDER':
        stage = 'orders';
        break;
      case 'HUMAN_HANDLE':
        stage = 'humanHandle';
        break;
      default:
        stage = 'generate';
        break;
    }
    return stage;
  }

  async condtionalStagesProduct(state: RAGState) {
    let stage = '';
    switch (state.intent) {
      case 'PRODUCT':
        stage = 'product';
        break;
      default:
        stage = 'retrieve';
        break;
    }
    return stage;
  }

  async productSerialiase(product: Product[]) {
    let context = `Toko menjual produk-produk berikut:\n`;

    product.forEach((p, index) => {
      context += `
          ${index + 1}. ${p.name}
          Deskripsi: ${p.description || 'Tidak tersedia'}
          Harga: ${p.price || 'Tidak tersedia'}
          ${p.image ? `IMAGE_PATH: ${p.image}` : 'Gambar: Tidak tersedia'}
        `;
    });

    return context.trim();
  }
}
