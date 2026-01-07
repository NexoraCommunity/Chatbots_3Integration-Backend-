import { Injectable, Logger } from '@nestjs/common';
import { initAuthCreds, BufferJSON, AuthenticationState } from 'baileys';
import { PrismaService } from 'src/module/prisma/service/prisma.service';

@Injectable()
export class WhatsappAuthService {
  private readonly logger = new Logger(WhatsappAuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async useDatabaseAuthState(sessionId: string): Promise<{
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
  }> {
    const session = await this.prisma.whatsappSession.findUnique({
      where: { id: sessionId },
    });

    let creds;
    try {
      creds = session
        ? JSON.parse(session.data, BufferJSON.reviver)
        : initAuthCreds();
    } catch (e) {
      this.logger.error(`❌ Session corrupted: ${e.message}`);
      creds = initAuthCreds();
    }

    const state: AuthenticationState = {
      creds,
      keys: {
        get: async (type, ids) => {
          const rows = await this.prisma.whatsappKeys.findMany({
            where: { sessionId, type, id: { in: ids } },
          });

          const result: Record<string, any> = {};

          for (const row of rows) {
            try {
              result[row.id] = JSON.parse(row.value, BufferJSON.reviver);
            } catch (err) {
              this.logger.warn(
                `⚠️ Corrupt key ${type}:${row.id} — ${err.message}`,
              );
            }
          }

          return result;
        },
        set: async (data) => {
          for (const type in data) {
            for (const [id, value] of Object.entries(data[type])) {
              if (value == null) {
                await this.prisma.whatsappKeys.deleteMany({
                  where: { sessionId, type, id },
                });
                continue;
              }

              const serialized = JSON.stringify(value, BufferJSON.replacer);

              await this.prisma.whatsappKeys.upsert({
                where: {
                  sessionId_id_type: { sessionId, id, type },
                },
                update: { value: serialized },
                create: {
                  sessionId,
                  type,
                  id,
                  value: serialized,
                },
              });
            }
          }
        },
      },
    };

    const saveCreds = async () => {
      await this.prisma.whatsappSession.upsert({
        where: { id: sessionId },
        update: {
          data: JSON.stringify(state.creds, BufferJSON.replacer),
        },
        create: {
          id: sessionId,
          data: JSON.stringify(state.creds, BufferJSON.replacer),
        },
      });

      this.logger.log(`💾 Auth creds for session "${sessionId}" saved`);
    };

    return { state, saveCreds };
  }
}
