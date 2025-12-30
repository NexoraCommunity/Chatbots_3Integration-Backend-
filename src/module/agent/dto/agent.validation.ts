import z, { ZodType } from 'zod';

export class AgentValidation {
  static readonly Agent: ZodType = z.object({
    name: z.string().min(1).max(100),
    dataTrain: z.string().min(0).max(50000).optional(),
    llm: z.string().min(1).max(100),
    agent: z.string().min(1).max(100),
    filePath: z.string().min(1).max(100),
    userId: z.string().min(1).max(225),
  });
  static readonly chageAgent: ZodType = z.object({
    id: z.string().min(1).max(225),
    name: z.string().min(1).max(100),
    llm: z.string().min(1).max(100),
    agent: z.string().min(1).max(100),
    filePath: z.string().min(1).max(100),
    dataTrain: z.string().min(0).max(50000).optional(),
  });
  static readonly Pagination: ZodType = z.object({
    page: z.string().min(1).max(50),
    limit: z.string().min(1).max(50),
  });
}
