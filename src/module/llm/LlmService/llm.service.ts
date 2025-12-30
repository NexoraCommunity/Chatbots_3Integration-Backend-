import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class LlmService {
  constructor(private readonly config: ConfigService) {}

  // Model yang BUKAN text generation
  private readonly TEXT_LLM_BLACKLIST = [
    'image',
    'audio',
    'whisper',
    'tts',
    'embedding',
    'search',
    'research',
    'guard',
    'safeguard',
    'prompt-guard',
  ];

  private isTextLLM(modelId: string): boolean {
    const lower = modelId.toLowerCase();
    return !this.TEXT_LLM_BLACKLIST.some((keyword) => lower.includes(keyword));
  }

  async getTextLLMModels() {
    try {
      const [openRouterRes, groqRes, geminiRes] = await Promise.all([
        axios.get('https://openrouter.ai/api/v1/models', {
          headers: {
            Authorization: `Bearer ${this.config.get('OPEN_ROUTER_API_KEY')}`,
          },
        }),
        axios.get('https://api.groq.com/openai/v1/models', {
          headers: {
            Authorization: `Bearer ${this.config.get('GROQ_API_KEY')}`,
          },
        }),
        axios.get(
          `https://generativelanguage.googleapis.com/v1/models?key=${this.config.get(
            'GEMINI_API_KEY',
          )}`,
        ),
      ]);

      // =========================
      // OPENROUTER / OPENAI
      // =========================
      const openAI = (openRouterRes.data?.data || [])
        .map((m) => m.id)
        .filter((id) => id.startsWith('openai/'))
        .filter((id) => this.isTextLLM(id))
        .sort();

      // =========================
      // GROQ
      // =========================
      const groq = (groqRes.data?.data || [])
        .map((m) => m.id)
        .filter((id) => this.isTextLLM(id))
        .sort();

      // =========================
      // GEMINI
      // =========================
      const gemini = (geminiRes.data?.models || [])
        .map((m) => m.name)
        .filter((id) => this.isTextLLM(id))
        .sort();

      return {
        openAI,
        groq,
        gemini,
      };
    } catch (err) {
      throw new Error(
        `LLM Model Fetch Error: ${err.response?.data?.error || err.message}`,
      );
    }
  }
}
