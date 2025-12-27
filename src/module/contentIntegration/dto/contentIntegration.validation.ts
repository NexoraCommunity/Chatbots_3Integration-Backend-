import z, { ZodType } from 'zod';

const GeminiConfigSchema = z.object({
  provider: z.literal('gemini'),
  apiKey: z.string().min(10),
});

const GroqConfigSchema = z.object({
  provider: z.literal('groq'),
  apiKey: z.string().min(10),
  model: z.string().min(1),
});
const OpenRouterConfigSchema = z.object({
  provider: z.literal('openRouter'),
  apiKey: z.string().min(10),
});

const WebsiteConfigSchema = z.object({
  provider: z.literal('website'),
  botName: z.string().min(1),
  position: z.enum(['bottom-left', 'bottom-right']),
  theme: z.enum(['dark', 'light']),
});

const BotFatherConfigSchema = z.object({
  provider: z.literal('botFather'),
  botName: z.string().min(1),
  accessToken: z.string().min(10),
});

export const ConfigByTypeSchema = z.discriminatedUnion('provider', [
  GeminiConfigSchema,
  GroqConfigSchema,
  OpenRouterConfigSchema,
  WebsiteConfigSchema,
  BotFatherConfigSchema,
]);

export class ContentIntegrationValidation {
  static readonly ContentIntegration: ZodType = z.object({
    userIntegrationId: z.string().min(1).max(225),
    type: z.string().min(1).max(100),
    configJson: ConfigByTypeSchema,
  });

  static readonly ChangeContentIntegration: ZodType = z.object({
    id: z.string().min(1).max(225),
    type: z.string().min(1).max(100),
    configJson: ConfigByTypeSchema,
  });
}
