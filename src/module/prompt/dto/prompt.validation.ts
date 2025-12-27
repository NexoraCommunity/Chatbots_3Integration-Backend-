import z, { ZodType } from 'zod';

export class PromptValidation {
  static readonly Prompt: ZodType = z.object({
    name: z.string().min(1).max(100),
    prompt: z.string().min(1).max(50000),
    llm: z.string().min(1).max(100),
    filePath: z.string().min(1).max(100).optional(),
    userId: z.string().min(1).max(225),
  });
  static readonly chagePrompt: ZodType = z.object({
    id: z.string().min(1).max(225),
    name: z.string().min(1).max(100),
    llm: z.string().min(1).max(100),
    filePath: z.string().min(1).max(100),
    prompt: z.string().min(1).max(50000),
  });
  static readonly Pagination: ZodType = z.object({
    page: z.string().min(1).max(50),
    limit: z.string().min(1).max(50),
  });
}
