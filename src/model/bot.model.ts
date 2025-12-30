import { Pagination } from './web.model';
import { Bot } from '@prisma/client';

export class BotApi {
  userId: string;
  agentId: string;
  data: string | null;
  numberPhoneWaba: string | null;
  botName: string;
  llm: string;
  model: string;
}

export class changeBot {
  id: string;
  agentId: string;
  data: string | null;
  numberPhoneWaba: string | null;
  llm: string;
  model: string;
  botName: string;
}
export class startBot {
  botId: string;
  type: string;
  data?: string;
  numberPhoneWaba?: string;
  llm: string;
  model: string;
}

export class botStatus {
  botId: string;
  type: string;
  data?: string;
  numberPhoneWaba?: string;
}

export class ResponseBot {
  botId?: string;
  message?: string;
  type?: string;
  qrCode?: string;
}
export class postBot {
  userId: string;
  agentId: string;
  botName: string;
  type: string;
  llm: string;
  model: string;
}

export class GetModelbot {
  userId?: string;
  page: string;
  limit: string;
}

export class PaginationResponseBot {
  bot: Bot[];
  Pagination: Pagination;
}
