export class ContentIntegrationApi<T> {
  type: string;
  configJson: T;
}

export class PostContentIntegration<T> {
  configJson: T;
  userIntegrationId: string;
  type: string;
}
export class ChangeContentIntegration<T> {
  id: string;
  type: string;
  configJson: T;
}

export interface GeminiConfig {
  provider: 'gemini';
  apiKey: string;
  name: string;
}

export interface GroqConfig {
  provider: 'groq';
  name: string;
  apiKey: string;
}
export interface OpenRouterConfig {
  provider: 'openRouter';
  apiKey: string;
  name: string;
}

export interface WebsiteConfig {
  provider: 'website';
  botName: string;
  position: 'bottom-left' | 'bottom-right';
  theme: 'dark' | 'light';
}
export interface botFatherConfig {
  provider: 'botFather';
  botName: string;
  accessToken: string;
}
export interface WabaConfig {
  provider: 'whatsapp Bussiness';
  numberPhoneId: string;
  whatsaapBussinessAccountId: string;
}

import { Prisma } from '@prisma/client';

export function toPrismaJson<T>(value: T): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

export type ContentIntegrationConfig =
  | GeminiConfig
  | GroqConfig
  | OpenRouterConfig
  | botFatherConfig
  | WebsiteConfig
  | WabaConfig;
