import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { GroqService } from 'src/module/llm/LlmService/groq.service';

@Injectable()
export class BotFatherService implements OnModuleInit {
  constructor(private groqService: GroqService) {}
  private bots = new Map<string, TelegramBot>();

  onModuleInit() {}

  async startBot(token: string, botId: string) {
    if (this.bots.has(botId)) {
      await this.disableBot(botId);
    }

    const bot = new TelegramBot(token, { polling: true });
    this.bots.set(botId, bot);

    bot.on('message', async (msg) => {
      if (msg.text) {
        const aiResponse = await this.groqService.createCompletions(
          String(msg.text),
        );
        bot.sendMessage(msg.chat.id, String(aiResponse));
      }
    });

    console.log(`Bot ${botId} started`);
  }

  async disableBot(botId: string) {
    const bot = this.bots.get(botId);
    if (!bot) {
      console.log(`Bot ${botId} not found`);
      return;
    }

    try {
      await bot.stopPolling();

      bot.removeAllListeners();

      this.bots.delete(botId);

      console.log(`Bot ${botId} disabled`);
    } catch (e) {
      console.error(`Error disabling bot ${botId}:`, e);
    }
  }

  async enableBot(botId: string, token: string) {
    this.disableBot(botId);
    console.log(`[${botId}] 🔋 Bot diaktifkan kembali — reconnecting...`);
    await this.startBot(token, botId);
  }
}
