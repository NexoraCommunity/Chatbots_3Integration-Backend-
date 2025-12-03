import { Pagination } from './web.model';
import { Conversation } from '@prisma/client';

export class ConversationApi {
  botId: string;
  room: string;
  integrationType: string;
}

export class PostConversation {
  botId: string;
  room: string;
  integrationType: string;
}
export class ChangeConversation {
  id: string;
  room: string;
  integrationType: string;
}

export class GetModelConversation {
  integrationType?: string | null;
  userId?: string | null;
  botId?: string | null;
  page: string;
  limit: string;
}

export class PaginationResponseConversation {
  Conversation: Conversation[];
  Pagination: Pagination;
}
