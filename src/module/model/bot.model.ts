import { Pagination } from './web.model';
import { Bot } from '@prisma/client';

export class BotApi {
  userId: string;
  promptId: string;
  bot_name: string;
  type: string;
}

export class changeBot {
  id: string;
  userId: string;
  promptId: string;
  bot_name: string;
}
export class startBot {
  botId: string;
  type: string;
}
export class postBot {
  userId: string;
  promptId: string;
  bot_name: string;
  type: string;
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
