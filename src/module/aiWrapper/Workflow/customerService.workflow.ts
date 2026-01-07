import { Injectable } from '@nestjs/common';
import { UserAgent } from '@prisma/client';
import { StateGraph } from '@langchain/langgraph';
import { VectorStoreService } from 'src/module/vector/service/vectoreStore.service';
import { XenovaEmbeddings } from 'src/module/embedding/service/xenovaEmbbeding.service';
import { RAGState, RAGStateAnnotation } from 'src/model/Rag.model';
import { START, END } from '@langchain/langgraph';
import { ChoosenLLmService } from './service/ChoosenLLm.service';
import { RAGService } from './service/RAG.service';

@Injectable()
export class CustomerServiceWorkFlow {
  constructor(
    private readonly vectorStoreService: VectorStoreService,
    private readonly embeddingService: XenovaEmbeddings,
    private readonly choosenLLmService: ChoosenLLmService,
    private ragService: RAGService,
  ) {}

  async workflow(agent: UserAgent, question: string) {
    const llm = await this.choosenLLmService.chooseLLM(
      agent.llm,
      agent.model,
      agent.apiKey,
    );

    const graph = new StateGraph(RAGStateAnnotation)
      .addNode(
        'retrieve',
        async (state) => await this.ragService.Retrieve(state, agent),
      )
      .addNode(
        'generate',
        async (state) => await this.ragService.Generate(state, agent, llm),
      );

    graph.addEdge(START, 'retrieve');
    graph.addEdge('retrieve', 'generate');
    graph.addEdge('generate', END);

    const app = graph.compile();
    const result = await app.invoke({
      question,
    });

    return result.answer;
  }
}
