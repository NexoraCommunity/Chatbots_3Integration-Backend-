import z, { ZodType } from 'zod';

export class BotValidation {
  static readonly WabaHook: ZodType = z.object({
    name: z.string().min(1).max(50),
    Bot: z.string().min(1).max(1000),
    llm: z.string().min(1).max(50),
    type: z.string().min(1).max(50),
  });

  static readonly Bot: ZodType = z.object({
    agentId: z.string().min(1).max(225),
    userId: z.string().min(1).max(225),
    botName: z.string().min(1).max(50),
    llm: z.string().min(1).max(100),
    data: z.string().min(0).max(100).optional(),
    numberPhoneWaba: z.string().min(0).max(100).optional(),
    model: z.string().min(1).max(100),
    type: z.string().min(1).max(50),
  });
  static readonly changeBot: ZodType = z.object({
    id: z.string().min(1).max(225),
    agentId: z.string().min(1).max(225),
    llm: z.string().min(1).max(100),
    model: z.string().min(1).max(100),
    data: z.string().min(0).max(100).optional(),
    numberPhoneWaba: z.string().min(0).max(100).optional(),
    botName: z.string().min(1).max(50),
  });
  static readonly Pagination: ZodType = z.object({
    page: z.string().min(1).max(50),
    limit: z.string().min(1).max(50),
  });
  static readonly StartBot: ZodType = z.object({
    id: z.string().min(1).max(225),
    type: z.string().min(1).max(50),
  });
}
