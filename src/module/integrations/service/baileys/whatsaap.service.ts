import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  makeWASocket,
  DisconnectReason,
  ConnectionState,
  BaileysEventMap,
} from 'baileys';
import * as qrcode from 'qrcode';
import * as qrcodeT from 'qrcode-terminal';
import { WhatsappAuthService } from './session.service';
import { PrismaService } from 'src/module/prisma/service/prisma.service';
import { AiService } from 'src/module/aiWrapper/service/aiWrapper.service';
import { ConversationWrapper } from 'src/model/aiWrapper.model';
import { BotService } from 'src/module/bot/service/bot.service';
import { UserAgent } from '@prisma/client';
import { CryptoService } from 'src/module/common/other/crypto.service';

type MessagesUpsert = BaileysEventMap['messages.upsert'];

@Injectable()
export class BaileysService implements OnModuleInit {
  constructor(
    private whatsappAuth: WhatsappAuthService,
    private prismaService: PrismaService,
    private aiService: AiService,
    private botService: BotService,
    private cryptoService: CryptoService,
  ) {}

  private bots = new Map<string, any>();
  private botCallbacks = new Map<string, (data: any) => void>();
  private forceStop = new Map<string, boolean>();

  async onModuleInit() {
    const botActives = await this.prismaService.bot.findMany({
      where: {
        isActive: true,
        type: 'baileys',
        numberPhoneWaba: null,
      },
    });

    botActives.map(async (e) => {
      const findAgent = await this.prismaService.userAgent.findUnique({
        where: { id: e.agentId },
      });
      if (findAgent) {
        this.startBot(e.id, {
          ...findAgent,
          apiKey: await this.cryptoService.decrypt(findAgent.apiKey),
        });
      }
    });
  }

  // Function to start and create new connection baileys
  async startBot(
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
        cb?.({
          message: 'Bot Connected To Whatsapp',
          type: 'baileys',
          botId: botId,
        });
        return;
      }

      const { state, saveCreds } =
        await this.whatsappAuth.useDatabaseAuthState(botId);

      const sock = makeWASocket({
        auth: state,
        syncFullHistory: false,
        shouldSyncHistoryMessage: (msg) => false,
      });

      // Function Connection Whatsapp Baileys
      const connectionUpdate = async (update: ConnectionState) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
          const QrCode = await qrcode.toDataURL(qr, { type: 'image/png' });
          qrcodeT.generate(qr, { small: true });
          cb?.({
            message: 'QrCode Generated',
            qrCode: QrCode,
            type: 'baileys',
            botId: botId,
          });
        }
        if (connection === 'open') {
          this.bots.set(botId, sock);
          cb?.({
            message: 'Bot Connected To Whatsapp',
            type: 'baileys',
            botId: botId,
          });
          await this.botService.updateBotStatus(
            { botId: botId, type: 'whatsapp' },
            true,
          );
        } else if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          if (shouldReconnect) {
            if (this.forceStop.get(botId)) {
              console.log(
                `[${botId}] ❌ Reconnect dibatalkan karena forceStop`,
              );
              this.forceStop.delete(botId);
              return;
            }

            setTimeout(() => {
              this.startBot(botId, agent);
            }, 5000);
          } else {
            this.forceStop.delete(botId);

            cb?.({
              message: `[${botId}] Logout total, perlu scan ulang. refresh halaman untuk generate qrCode`,
              type: 'baileys',
              botId: botId,
            });
            await this.logOut(botId);
          }
        }
      };

      // Function Save Session Baileys
      const credsUpdate = async () => {
        await saveCreds();
        if (this.bots.get(botId)) return;
        sendUpdate?.({
          message: 'QR berhasil discan. Connecting...',
          botId: botId,
          type: 'baileys',
        });
      };

      // Function Catch MessageUpdate Baileys
      const messageUpsert = async (msg: MessagesUpsert) => {
        try {
          const m = msg.messages[0];
          if (!m.message) return;
          if (!m.key.fromMe) {
            const sender = m.key.remoteJid;
            if (
              !sender?.endsWith('@lid') &&
              !sender?.endsWith('@s.whatsapp.net')
            )
              return;
            const text =
              m.message?.conversation?.toLowerCase() ||
              m.message?.extendedTextMessage?.text;

            if (text) {
              const data: ConversationWrapper = {
                room: `${botId}${sender}`,
                botId: botId,
                integrationType: 'baileys',
                message: text,
              };
              const aiResponse = await this.aiService.wrapper(data, agent);

              if (aiResponse) {
                await sock.sendMessage(String(sender), {
                  text: String(aiResponse),
                });
              }
            }
          }
        } catch (err: any) {
          if (err.message?.includes('No session found to decrypt message')) {
            console.warn('⚠️ Pesan tidak bisa didekripsi, lewati.');
          }
          console.error('❌ Error saat memproses pesan:', err);
        }
      };

      // ------ Sequence code run here ------

      // Socket and Event Baileys
      sock.ev.on('connection.update', connectionUpdate);
      sock.ev.on('creds.update', credsUpdate);
      sock.ev.on('messages.upsert', messageUpsert);

      // ------ End Sequence ------
    } catch (err) {
      cb?.({
        message: `Cannot StartBot Because: ${err}`,
        botId: botId,
        type: 'baileys',
      });
    }
  }

  // Function to disbale connection baileys
  async disableBot(botId: string, sendUpdate?: (data: any) => void) {
    this.forceStop.set(botId, true);

    const sock = this.bots.get(botId);
    if (sock) {
      await sock.ws.close();
      await sock.ev.removeAllListeners();
      sendUpdate?.({
        message: 'Bot Disconnected to Whatsapp',
        botId: botId,
        type: 'baileys',
      });
      this.bots.delete(botId);

      await this.botService.updateBotStatus(
        { botId: botId, type: 'whatsapp' },
        false,
      );
    }
  }

  // Function to handle when user delete session scan
  async logOut(botId: string) {
    this.bots.delete(botId);
    await this.botService.updateBotStatus(
      { botId: botId, type: 'whatsapp' },
      false,
    );
    await this.prismaService.whatsappSession.delete({
      where: {
        id: botId,
      },
    });

    await this.prismaService.whatsappKeys.deleteMany({
      where: {
        sessionId: botId,
      },
    });
  }
}
