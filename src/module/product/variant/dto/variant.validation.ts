import z, { ZodType } from 'zod';

export class VariantValidation {
  static readonly VariantOption: ZodType = z.object({
    productId: z.string().min(1).max(225),
    name: z.string().min(1).max(50),
  });
  static readonly VariantValue: ZodType = z.object({
    optionId: z.string().min(1).max(225),
    value: z.string().min(1).max(500),
  });
  static readonly ProductVariantValue: ZodType = z.object({
    variantId: z.string().min(1).max(225),
    valueId: z.string().min(1).max(225),
  });
  static readonly ProductVariant: ZodType = z.object({
    productId: z.string().min(1).max(225),
    image: z.string().min(1).max(550),
    sku: z.string().min(1).max(50),
    stock: z.number(),
    price: z.number(),
  });
  static readonly changeProduct: ZodType = z.object({
    id: z.string().min(1).max(225),
    image: z.string().min(1).max(550),
    sku: z.string().min(1).max(50),
    stock: z.number(),
    price: z.number(),
  });
}
