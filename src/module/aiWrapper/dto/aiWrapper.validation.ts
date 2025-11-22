import z, { ZodType } from 'zod';

export class AiWrapperValidation {
  static readonly aiWrapper: ZodType = z.object({
    room: z.string().min(1).max(225),
    integrationType: z.string().min(1).max(100),
    message: z.string().min(1),
    botId: z.string().min(1).max(225),
  });
}
