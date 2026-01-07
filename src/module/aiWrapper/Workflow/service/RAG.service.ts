import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';
import { ChatOpenAI, ChatOpenAICallOptions } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { UserAgent } from '@prisma/client';
import { RAGState } from 'src/model/Rag.model';
import { XenovaEmbeddings } from 'src/module/embedding/service/xenovaEmbbeding.service';
import { VectorStoreService } from 'src/module/vector/service/vectoreStore.service';

@Injectable()
export class RAGService {
  constructor(
    private readonly vectorStoreService: VectorStoreService,
    private readonly embeddingService: XenovaEmbeddings,
  ) {}

  async Retrieve(state: RAGState, agent: UserAgent) {
    const embedding = await this.embeddingService.embedQuery(state.question);

    const filter = {
      must: [
        {
          key: 'userId',
          match: {
            value: agent.userId,
          },
        },
        {
          key: 'documentId',
          match: {
            value: agent.id,
          },
        },
      ],
    };

    const results = await this.vectorStoreService.similaritySearch(
      embedding,
      'AgentUserDocument',
      filter,
      4,
    );

    const docs = results?.map((r) => r.payload?.textPreview ?? '');

    return {
      documents: docs,
    };
  }

  async Generate(
    state: RAGState,
    agent: UserAgent,
    llm: ChatGroq | ChatGoogleGenerativeAI | ChatOpenAI<ChatOpenAICallOptions>,
  ) {
    const context = state.documents?.join('\n\n') ?? '';

    const prompt = ` ${agent.prompt}
                          KONTEKS:
                          ${context}

                          PERTANYAAN:
                          ${state.question}

                          JAWABAN:
                          `;

    const completion = await llm.invoke(prompt);

    return {
      answer: completion.content,
    };
  }
}
