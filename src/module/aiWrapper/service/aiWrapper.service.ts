import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/common/prisma.service';
import { GroqService } from 'src/module/llm/LlmService/groq.service';

Injectable();
export class AiService {
  constructor(
    private prismaService: PrismaService,
    private groqService: GroqService,
  ) {}

  async wrapper(type: string) {
    return 'Response';
  }

  async;
}
