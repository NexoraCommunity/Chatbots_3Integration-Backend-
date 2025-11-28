import z, { ZodType } from 'zod';

export class ConversationValidation {
  static readonly Conversation: ZodType = z.object({
    botId: z.string().min(1).max(225),
    room: z.string().min(1).max(1000),
  });
  static readonly ChangeConversation: ZodType = z.object({
    id: z.string().min(1).max(225),
    room: z.string().min(1).max(550),
  });
  static readonly Pagination: ZodType = z.object({
    page: z.string().min(1).max(50),
    limit: z.string().min(1).max(50),
    integrationType: z.string().min(1).max(50).optional(),
  });
}
