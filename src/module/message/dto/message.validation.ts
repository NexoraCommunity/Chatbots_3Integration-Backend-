import z, { ZodType } from 'zod';

const MessageResponse = z.object({
  image: z.string().nullable().optional(),
  text: z.string().min(1),
  type: z.string().min(1),
});

export class MessageValidation {
  static readonly Message: ZodType = z.object({
    conversationId: z.string().min(1).max(225),
    message: MessageResponse,
    type: z.string().min(1).max(50),
    sentiment: z.string().min(1).max(50),
    role: z.string().min(1).max(50),
  });
  static readonly chageMessage: ZodType = z.object({
    id: z.string().min(1).max(225),
    message: MessageResponse,
    type: z.string().min(1).max(50),
    sentiment: z.string().min(1).max(50),
  });
  static readonly Pagination: ZodType = z.object({
    page: z.string().min(1).max(50),
    limit: z.string().min(1).max(50),
    conversationId: z.string().min(1).max(225).optional(),
  });
}
