import z, { ZodType } from 'zod';

export class ProductValidation {
  static readonly Product: ZodType = z.object({
    conversationId: z.string().min(1).max(225),
    message: z.string().min(1).max(50000),
    type: z.string().min(1).max(50),
    role: z.string().min(1).max(50),
  });
  static readonly changeProduct: ZodType = z.object({
    id: z.string().min(1).max(225),
    message: z.string().min(1).max(50000).optional(),
    type: z.string().min(1).max(50).optional(),
  });
  static readonly Pagination: ZodType = z.object({
    page: z.string().min(1).max(50),
    limit: z.string().min(1).max(50),
    userId: z.string().min(1).max(225).optional(),
  });
}
