import z, { ZodType } from 'zod';

export class ConversationValidation {
  static readonly Conversation: ZodType = z.object({
    botId: z.string().min(1).max(225),
    sender: z.string().min(1).max(225),
    room: z.string().min(1).max(1000),
    humanHandle: z.boolean(),
  });
  static readonly ChangeConversation: ZodType = z.object({
    id: z.string().min(1).max(225),
    room: z.string().min(1).max(550),
    sender: z.string().min(1).max(225),
    humanHandle: z.boolean(),
  });
  static readonly Pagination: ZodType = z.object({
    page: z.string().min(1).max(50),
    limit: z.string().min(1).max(50),
    userId: z.string().min(1).max(225).optional(),
    humanHandle: z.boolean().optional(),
    botId: z.string().min(1).max(225).optional(),
    integrationType: z.string().min(1).max(50).optional(),
  });
}
