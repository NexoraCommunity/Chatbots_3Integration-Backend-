import z, { ZodType } from 'zod';

export class MessageValidation {
  static readonly Message: ZodType = z.object({
    conversationId: z.string().min(1).max(225),
    message: z.string().min(1).max(50000),
    type: z.string().min(1).max(50),
    sentiment: z.string().min(1).max(100).optional(),
  });
  static readonly chageMessage: ZodType = z.object({
    id: z.string().min(1).max(225),
    message: z.string().min(1).max(50000),
    type: z.string().min(1).max(50),
    sentiment: z.string().min(1).max(100).optional(),
  });
  static readonly Pagination: ZodType = z.object({
    page: z.string().min(1).max(50),
    limit: z.string().min(1).max(50),
  });
}
