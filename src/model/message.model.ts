import { MessageResponse } from './Rag.model';
import { Pagination } from './web.model';
import { Message } from '@prisma/client';

export class MessageApi {
  conversationId: string;
  message: MessageResponse;
  sentiment: string;
  type: string;
  role: string;
}

export class PostMessage {
  conversationId: string;
  type: string;
  sentiment: string;
  message: MessageResponse;
  role: string;
}
export class ChangeMessage {
  id: string;
  type: string;
  sentiment: string;
  message: MessageResponse;
  role: string;
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
