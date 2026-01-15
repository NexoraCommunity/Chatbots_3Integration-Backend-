import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { UserAgent } from '@prisma/client';
import { LLMPlatform, RAGState } from 'src/model/Rag.model';
import { XenovaEmbeddings } from 'src/module/embedding/service/xenovaEmbbeding.service';
import { VectorStoreService } from 'src/module/vector/service/vectoreStore.service';
import { ChatMemoryRedisService } from '../ChatMemoryRedis.service';
import { OpenAiEmbbedingService } from 'src/module/embedding/service/openAIEmbedding.service';

@Injectable()
export class RAGService {
  constructor(
    private readonly vectorStoreService: VectorStoreService,
    private readonly embeddingService: XenovaEmbeddings,
    private readonly openAIEmbeddingService: OpenAiEmbbedingService,
    private memorizeService: ChatMemoryRedisService,
  ) {}

  async classifyTools(question: string, llm: LLMPlatform, category: string) {
    const prompt = `
    Classify the customer question into one category name:
    ${category}

    Question: ${question}

    Answer ONLY CATEGORY NAME ABOVE
    `;

    const res = await llm.invoke(prompt);

    return res.content;
  }

  async classifyIntent(state: RAGState, llm: LLMPlatform) {
    const category = `
      - LEAD
      - PRODUCT
      - ORDER (ONLY FOR USER ORDER PRODUCT)
    `;
    const res = await this.classifyTools(state.question, llm, category);

    console.log(res);

    return {
      intent: res,
    };
  }

  async Retrieve(state: RAGState, agent: UserAgent) {
    // const embedding = await this.embeddingService.embedQuery(state.question);
    const embedding = await this.openAIEmbeddingService.embedQuery(
      state.question,
    );

    if (!embedding) return;

    const baseFilter = {
      must: [{ key: 'userId', match: { value: agent.userId } }],
    };

    const collection = 'AgentUserDocument';

    const results = await this.vectorStoreService.similaritySearch(
      embedding,
      collection,
      baseFilter,
      3,
    );

    if (results)
      return {
        documents: results.map((r) => r.payload?.text ?? ''),
      };
  }

  customerServicePrompt(
    agentPrompt: string | null,
    memory: string,
    context: string | null,
    product: string,
    question: string,
    order: string,
  ) {
    return `
    YOU ARE A DOCUMENT-BASED CUSTOMER SERVICE AI.

      YOUR_CHARACTHER: 
      ${agentPrompt || ''}

      QUERY TYPE:
      - INFORMATIONAL: pertanyaan tentang produk, harga, ketersediaan, jam operasional, kebijakan
      - CONVERSATIONAL: salam, ucapan terima kasih, konfirmasi, emosi

      CONVERSATIONAL RULE:
      - Untuk CONVERSATIONAL, jawab singkat dan ramah
      - Tidak wajib menggunakan KNOWLEDGE CONTEXT

      STRICT GUIDELINES:
      1. Jawaban HARUS berdasarkan KNOWLEDGE CONTEXT
      2. Jangan menambahkan informasi di luar konteks
      3. Jika informasi tidak tersedia, sampaikan dengan bahasa sopan dan natural:
        "Maaf ya Kak, informasi tersebut belum tersedia di data kami 🙏"
      4. Jawaban maksimal 2–3 kalimat
      5. Jangan menyebut kata seperti "berdasarkan data" atau "konteks"
      
      PRODUCT RULE (OVERRIDING):
      - Setiap produk → 1 message
      - Jangan menggabungkan produk
      - Gunakan bahasa promosi ringan dan ramah

      ORDER RULE (IMPORTANT):
      - IF THE ORDER IS COMPLETE AND FINISHED, END THE CONVERSATION, SAY THANK YOU, AND SWITCH TO A HUMAN CUSTOMER SERVICE REPRESENTATIVE.
    
      IMAGE RULES (VERY IMPORTANT):
      - You MUST ONLY include "image" if an EXACT image path string already exists in the KNOWLEDGE CONTEXT.
      - You MUST copy the image path EXACTLY as written .
      - You MUST NOT create, guess, or modify image paths.
      - If no image path exists in the context, set image to null.

      CONVERSATION HISTORY:
      ${memory || 'No previous conversation.'}

      KNOWLEDGE CONTEXT:
      ${context || 'EMPTY'}
      ${product}


      ORDER:
      ${order}

     

      CUSTOMER QUESTION:
      ${question}

      OUTPUT FORMAT (JSON ONLY, NO EXTRA TEXT):
     
      SINGLE MESSAGE EXAMPLE:
      {
        "messages": [
        {
          "text": "Jawaban ramah dan natural",
          "image": null
        }
       ]
      }

      MULTIPLE MESSAGE EXAMPLE:
      {
        "messages": [
          {
            "text": "FIRST ANSWER TEXT",
            "image": null
          },
          {
            "text": "SECOND ANSWER TEXT",
            "image": null
          }
        ]
      }
    `;
  }
  async Generate(state: RAGState, agent: UserAgent, llm: LLMPlatform) {
    const history = this.memorizeService.trimHistory(state.chatHistory ?? []);
    const memory = this.memorizeService.formatChatHistory(history);
    const context = state.documents?.join('\n\n') ?? null;
    const product = state.products ?? '';
    const order = state.order ?? '';
    console.log(order);

    const prompt = this.customerServicePrompt(
      agent?.prompt,
      memory,
      context,
      product,
      state.question,
      order,
    );

    const completion = await llm.invoke(prompt);

    return {
      answer: completion.content,
      chatHistory: [{ role: 'assistant', content: completion.content }],
    };
  }
}
