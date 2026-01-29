import z, { ZodType } from 'zod';
const MessageResponse = z.object({
  image: z.string().nullable().optional(),
  text: z.string().min(1),
  type: z.string().min(1),
});

export class AiWrapperValidation {
  static readonly aiWrapper: ZodType = z.object({
    room: z.string().min(1).max(225),
    integrationType: z.string().min(1).max(100),
    message: MessageResponse,
    humanHandle: z.boolean(),
    sender: z.string().min(1),
    botId: z.string().min(1).max(225),
  });
}
