import z, { ZodType } from 'zod';

export class UserIntegrationValidation {
  static readonly UserIntegration: ZodType = z.object({
    integrationId: z.number(),
    userId: z.string().min(1).max(225),
    isconneted: z.boolean(),
  });
  static readonly ChangeUserIntegration: ZodType = z.object({
    id: z.string().min(1).max(225),
    isconneted: z.boolean(),
  });
}
