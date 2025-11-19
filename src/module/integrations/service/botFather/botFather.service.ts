import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { ConversationWrapper } from 'src/model/aiWrapper';
import { ResponseBot } from 'src/model/bot.model';
import { AiService } from 'src/module/aiWrapper/service/aiWrapper.service';
import { PrismaService } from 'src/module/common/prisma.service';

@Injectable()
export class BotFatherService implements OnModuleInit {
  constructor(
    private aiService: AiService,
    private prismaService: PrismaService,
  ) {}
  private bots = new Map<string, TelegramBot>();
  private disbledBots = new Map<string, TelegramBot>();

  async onModuleInit() {
    const botActives = await this.prismaService.bot.findMany({
      where: {
        is_active: true,
        type: 'telegram',
      },
    });

    botActives.map((e) => {
      this.startBot(String(e.data), e.id);
    });
  }

  async startBot(
    token: string,
    botId: string,
    sendUpdate?: (data: any) => void,
  ) {
    try {
      if (this.bots.has(botId)) {
        console.log(`[${botId}] Bot sedang aktif`);
        sendUpdate?.({ message: '⚠️  Bot Sedang Aktif', botId: botId });
        return;
      }
      const bot = new TelegramBot(token, { polling: true });
      this.bots.set(botId, bot);

      bot.on('message', async (msg) => {
        if (msg.text) {
          const data: ConversationWrapper = {
            room: `${botId}${msg.from?.id}`,
            botId: botId,
            integrationType: 'botFather',
            message: msg.text,
          };
          const aiResponse = await this.aiService.wrapper(data);
          bot.sendMessage(msg.chat.id, String(aiResponse));
        }
      });

      sendUpdate?.({
        message: 'Bot Connected To Telegram',
        botId: botId,
        type: 'telegram',
      });

      return;
    } catch (error) {
      sendUpdate?.({
        message: `Cannot Connected Because: ${error} `,
        botId: botId,
        type: 'telegram',
      });
      return;
    }
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
}
