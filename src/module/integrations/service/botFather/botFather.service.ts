import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserAgent } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { ConversationWrapper } from 'src/model/aiWrapper.model';
import { AiService } from 'src/module/aiWrapper/service/aiWrapper.service';
import { BotService } from 'src/module/bot/service/bot.service';
import { CryptoService } from 'src/module/common/other/crypto.service';
import { PrismaService } from 'src/module/prisma/service/prisma.service';

@Injectable()
export class BotFatherService implements OnModuleInit {
  constructor(
    private aiService: AiService,
    private prismaService: PrismaService,
    private botService: BotService,
    private cryptoService: CryptoService,
  ) {}
  private bots = new Map<string, TelegramBot>();
  private botCallbacks = new Map<string, (data: any) => void>();

  async onModuleInit() {
    const botActives = await this.prismaService.bot.findMany({
      where: {
        isActive: true,
        type: 'botFather',
      },
    });

    botActives.map(async (e) => {
      const findAgent = await this.prismaService.userAgent.findUnique({
        where: { id: e.agentId },
      });
      if (findAgent) {
        this.startBot(String(e.data), e.id, {
          ...findAgent,
          apiKey: await this.cryptoService.decrypt(findAgent.apiKey),
        });
      }
    });
  }

  // Function to start and create connection botfather
  async startBot(
    token: string,
    botId: string,
    agent: UserAgent,
    sendUpdate?: (data: any) => void,
  ) {
    if (sendUpdate) {
      this.botCallbacks.set(botId, sendUpdate);
    }
    const cb = this.botCallbacks.get(botId);
    try {
      if (this.bots.has(botId)) {
        cb?.({ message: '⚠️bot Connected to Telegram', botId: botId });
        return;
      }
      const bot = new TelegramBot(token, { polling: true });

      const pollingError = (error) => {
        cb?.({
          message: 'Unauthorization token invalid!!',
          botId: botId,
          type: 'botFather',
        });
        bot.stopPolling();
        this.disableBot(botId);
      };

      const Connection = () => {
        this.bots.set(botId, bot);
        this.botService.updateBotStatus(
          { botId: botId, data: token, type: 'botFather' },
          true,
        );
        cb?.({
          message: 'Bot Connected To Telegram',
          botId: botId,
          type: 'botFather',
        });
      };

      const message = async (msg) => {
        if (msg.text) {
          const data: ConversationWrapper = {
            room: `${botId}${msg.from?.id}`,
            botId: botId,
            integrationType: 'botFather',
            humanHandle: false,
            message: msg.text,
          };
          const aiResponse = await this.aiService.wrapper(data, agent);

          if (aiResponse?.messages.length !== undefined) {
            aiResponse.messages.map(async (e) => {
              if (!e.image) {
                bot.sendMessage(msg.chat.id, e.text);
              } else {
                bot.sendPhoto(msg.chat.id, e.image, { caption: e.text });
              }
            });
          }
        }
      };

      const deletedToken = () => {
        cb?.({
          message: '❌ Invalid or deleted bot token ',
          botId,
          type: 'botFather',
        });

        this.disableBot(botId);

        bot.stopPolling();
      };

      // ------ Sequence code run here ------

      bot.on('polling_error', pollingError);

      const isconnect = await bot.getMe();

      if (!isconnect) {
        deletedToken();
      }

      bot.on('message', message);
      Connection();

      // ------ End Sequence ------
    } catch (error) {
      cb?.({
        message: `Cannot Connected Because: ${error}`,
        botId: botId,
        type: 'botFather',
      });
      return;
    }
  }

  // Function to disable connection botfather
  async disableBot(botId: string, sendUpdate?: (data: any) => void) {
    const bot = this.bots.get(botId);
    if (!bot) {
      sendUpdate?.({
        message: 'Bot Id Not Found',
        botId: botId,
        type: 'botFather',
      });
      return;
    }

    this.botService.updateBotStatus({ botId: botId, type: 'telegram' }, false);
    sendUpdate?.({
      message: 'Bot Disconnected to Telegram',
      botId: botId,
      type: 'botFather',
    });

    try {
      await bot.stopPolling();

      bot.removeAllListeners();

      this.bots.delete(botId);
    } catch (e) {
      sendUpdate?.({
        message: `Error disabling bot Because: ${e}`,
        botId: botId,
        type: 'botFather',
      });
    }
  }
}
