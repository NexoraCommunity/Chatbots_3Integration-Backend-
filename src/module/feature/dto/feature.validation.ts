import z, { ZodType } from 'zod';

export class FeatureValidation {
  static readonly Feature: ZodType = z.object({
    featureName: z.string().min(1).max(500),
    subcribtionId: z.number(),
  });
  static readonly changeFeature: ZodType = z.object({
    id: z.string().min(1).max(225),
    featureName: z.string().min(1).max(500),
    subcribtionId: z.number(),
  });
}
