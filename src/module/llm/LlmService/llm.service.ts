import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class LlmService {
  constructor(private readonly config: ConfigService) {}

  async getOpenRouterModels() {
    try {
      const openAiModels = await axios.get(
        'https://openrouter.ai/api/v1/models',
        {
          headers: {
            Authorization: `Bearer ${this.config.get('OPEN_ROUTER_API_KEY')}`,
          },
        },
      );
      const groqModels = await axios.get(
        'https://api.groq.com/openai/v1/models',
        {
          headers: {
            Authorization: `Bearer ${this.config.get('GROQ_API_KEY')}`,
          },
        },
      );

      const geminiModels = await axios.get(
        `https://generativelanguage.googleapis.com/v1/models?key=${this.config.get(
          'GEMINI_API_KEY',
        )}`,
      );

      const models = openAiModels.data.data || [];

      const openAI = models
        .filter((m) => m.id.startsWith('openai/'))
        .map((m) => m.id);

      const groq = groqModels.data.data.map((m) => m.id);

      const gemini = geminiModels.data.models.map((m) => m.name);

      return {
        openAI,
        groq,
        gemini,
      };
    } catch (err) {
      throw new Error(
        `OpenRouter Error: ${err.response?.data?.error || err.message}`,
      );
    }
  }
}
