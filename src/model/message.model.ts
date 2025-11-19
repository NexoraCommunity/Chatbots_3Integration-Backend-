import { Pagination } from './web.model';
import { Message } from '@prisma/client';

export class MessageApi {
  conversationId: string;
  message: string;
  type: string;
}

export class PostMessage {
  conversationId: string;
  type: string;
  message: string;
}
export class ChangeMessage {
  id: string;
  type: string;
  message: string;
  sentiment: string;
}

export class GetModelMessage {
  conversationId?: string;
  page: string;
  limit: string;
}

export class PaginationResponseMessage {
  message: Message[];
  Pagination: Pagination;
}
