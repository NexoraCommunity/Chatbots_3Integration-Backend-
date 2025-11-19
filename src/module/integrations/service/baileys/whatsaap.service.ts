import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'baileys';
import * as qrcode from 'qrcode';
import * as qrcodeT from 'qrcode-terminal';
import { WhatsappAuthService } from './session.service';
import { PrismaService } from 'src/module/common/prisma.service';
import { AiService } from 'src/module/aiWrapper/service/aiWrapper.service';
import { ConversationWrapper } from 'src/model/aiWrapper';
import { ResponseBot } from 'src/model/bot.model';

@Injectable()
export class BaileysService implements OnModuleInit {
  constructor(
    private whatsappAuth: WhatsappAuthService,
    private prismaService: PrismaService,
    private aiService: AiService,
  ) {}

  private bots = new Map<string, any>();

  async onModuleInit() {
    const botActives = await this.prismaService.bot.findMany({
      where: {
        is_active: true,
        type: 'whatsapp',
      },
    });

    botActives.map((e) => {
      this.startBot(e.id);
    });
  }

  async startBot(botId: string, sendUpdate?: (data: any) => void) {
    try {
      if (this.bots.has(botId)) {
        console.log(`[${botId}] Bot sedang aktif`);
        sendUpdate?.({ message: '⚠️  Bot Sedang Aktif', botId: botId });
        return;
      }
      const { state, saveCreds } =
        await this.whatsappAuth.useDatabaseAuthState(botId);

      const sock = makeWASocket({
        auth: state,
        syncFullHistory: false,
        shouldSyncHistoryMessage: (msg) => false,
      });

      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
          const QrCode = await qrcode.toDataURL(qr, { type: 'image/png' });
          qrcodeT.generate(qr, { small: true });
          sendUpdate?.({
            message: 'QrCode Generated',
            qrCode: QrCode,
            type: 'whatsapp',
            botId: botId,
          });
          return;
        }
        if (connection === 'open') {
          this.bots.set(botId, sock);
          sendUpdate?.({
            message: 'Bot Connected to whatsapp',
            type: 'whatsapp',
            botId: botId,
          });
          return;
        } else if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          if (shouldReconnect) {
            console.log(`[${botId}] 🔁 Reconnect...`);

            setTimeout(() => {
              this.startBot(botId);
            }, 5000);
          } else {
            console.log(`[${botId}] Logout total, perlu scan ulang`);
            await this.logOut(botId);
            sendUpdate?.({
              message: `[${botId}] Logout total, perlu scan ulang. refresh halaman untuk generate qrCode`,
              type: 'whatsapp',
              botId: botId,
            });
            return;
          }
        }
      });

      sock.ev.on('creds.update', async () => {
        await saveCreds();
        if (this.bots.get(botId)) return;
        sendUpdate?.({
          message: 'QR berhasil discan. please refresh page!!',
          botId: botId,
          type: 'whatsapp',
        });
      });

      sock.ev.on('messages.upsert', async (msg) => {
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
              const aiResponse = await this.aiService.wrapper(data);

              await sock.sendMessage(String(sender), {
                text: String(aiResponse),
              });
            }
          }
        } catch (err: any) {
          if (err.message?.includes('No session found to decrypt message')) {
            console.warn('⚠️ Pesan tidak bisa didekripsi, lewati.');
            return;
          }
          console.error('❌ Error saat memproses pesan:', err);
        }
      });
    } catch (err) {
      sendUpdate?.({
        message: `Cannot StartBot Because: ${err}`,
        botId: botId,
        type: 'whatsapp',
      });
      return;
    }
  }

  async disableBot(botId: string) {
    const sock = this.bots.get(botId);
    if (sock) {
      await sock.ws.close();
      this.bots.delete(botId);
    }
    console.log(`[${botId}] 🔌 Bot dinonaktifkan`);
  }

  async logOut(botId: string) {
    this.bots.delete(botId);
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
