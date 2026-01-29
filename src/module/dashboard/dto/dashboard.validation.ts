import z, { ZodType } from 'zod';

export class DashboardValidation {
  static readonly Dashboard: ZodType = z.object({
    userId: z.string().min(1).max(225),
    rangeDate: z.string().min(1).optional(),
  });
}
