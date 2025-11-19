import { Injectable } from '@nestjs/common';
import { ConversationWrapper } from 'src/model/aiWrapper';
import { PrismaService } from 'src/module/common/prisma.service';
import { GroqService } from 'src/module/llm/LlmService/groq.service';

Injectable();
export class AiService {
  constructor(
    private prismaService: PrismaService,
    private groqService: GroqService,
  ) {}

  async wrapper(type: ConversationWrapper) {
    return 'Response';
  }

  async;
}
