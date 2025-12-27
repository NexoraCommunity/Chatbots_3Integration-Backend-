import z, { ZodType } from 'zod';

export class ProductValidation {
  static readonly Product: ZodType = z.object({
    userId: z.string().min(1).max(225),
    categoryId: z.string().min(1).max(225),
    name: z.string().min(1).max(500),
    description: z.string().min(1).max(1000),
    price: z.number(),
    stock: z.number(),
    weight: z.number(),
    image: z.string().min(1).max(500),
    sku: z.string().min(1).max(50),
  });
  static readonly changeProduct: ZodType = z.object({
    id: z.string().min(1).max(225),
    categoryId: z.string().min(1).max(225),
    name: z.string().min(1).max(500),
    description: z.string().min(1).max(1000),
    price: z.number(),
    stock: z.number(),
    weight: z.number(),
    image: z.string().min(1).max(500),
    sku: z.string().min(1).max(50),
  });
  static readonly Pagination: ZodType = z.object({
    page: z.string().min(1).max(50),
    limit: z.string().min(1).max(50),
    userId: z.string().min(1).max(225).optional(),
  });
}
