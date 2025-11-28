import z, { ZodType } from 'zod';

export class CategoryValidation {
  static readonly Category: ZodType = z.object({
    name: z.string().min(1).max(225),
  });
  static readonly ChangeCategory: ZodType = z.object({
    id: z.string().min(1).max(225),
    name: z.string().min(1).max(225),
  });
  static readonly Pagination: ZodType = z.object({
    page: z.string().min(1).max(50),
    limit: z.string().min(1).max(50),
  });
}
