import { Injectable, OnModuleInit } from '@nestjs/common';
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'baileys';
import * as qrcode from 'qrcode-terminal';
import { WhatsappAuthService } from './session.service';
import { PrismaService } from 'src/module/common/prisma.service';
import { GroqService } from 'src/module/llm/LlmService/groq.service';

@Injectable()
export class WhatsaapManagerService implements OnModuleInit {
  constructor(
    private whatsappAuth: WhatsappAuthService,
    private prismaService: PrismaService,
    private groqService: GroqService,
  ) {}

  private bots = new Map<string, any>();
  private disabledBots = new Set<string>();

  async onModuleInit() {
    this.startBot('okay');
  }

  async startBot(botId: string) {
    if (this.disabledBots.has(botId)) {
      console.log(`[${botId}] ⚠️ Bot sedang nonaktif `);
      return;
    }

    try {
      const { state, saveCreds } =
        await this.whatsappAuth.useDatabaseAuthState(botId);

      const sock = makeWASocket({
        auth: state,
        syncFullHistory: true,
        shouldSyncHistoryMessage: (msg) => true,
      });

      this.bots.set(botId, sock);

      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
          console.log(`[${botId}] QR baru muncul, scan di terminal`);
          qrcode.generate(qr, { small: true });
        }
        if (connection === 'open') {
          console.log(`[${botId}] ✅ Terhubung ke WhatsApp`);
        } else if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
          console.log(`[${botId}] ❌ Terputus (${statusCode})`);
          if (shouldReconnect) {
            console.log(`[${botId}] 🔁 Reconnect...`);
            this.startBot(botId);
          } else {
            console.log(`[${botId}] Logout total, perlu scan ulang`);
            await this.logOut(botId);
          }
        }
      });

      sock.ev.on('creds.update', saveCreds);

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
              const aiResponse = await this.groqService.createCompletions(
                String(text),
              );

              await sock.sendMessage(String(sender), {
                text: String(aiResponse),
              });
            }
          }
        } catch (err: any) {
          if (err.message?.includes('No session found to decrypt message')) {
            console.warn('⚠️ Pesan tidak bisa didekripsi, lewati. ');
            return;
          }
          console.error('❌ Error saat memproses pesan:', err);
        }
      });
    } catch (err) {
      console.log(`Gagal start bot ${botId}: ${err}`);
    }
  }

  async disableBot(botId: string) {
    this.disabledBots.add(botId);

    const sock = this.bots.get(botId);
    if (sock) {
      await sock.ws.close();
      this.bots.delete(botId);
    }

    console.log(`[${botId}] 🔌 Bot dinonaktifkan`);
  }
  async enableBot(botId: string) {
    this.disabledBots.delete(botId);
    console.log(`[${botId}] 🔋 Bot diaktifkan kembali — reconnecting...`);
    await this.startBot(botId);
  }

  async logOut(botId: string) {
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
