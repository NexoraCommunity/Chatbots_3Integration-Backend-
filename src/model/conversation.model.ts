import { Pagination } from './web.model';
import { Conversation } from '@prisma/client';

export class ConversationApi {
  botId: string;
  room: string;
  humanHandle: boolean;
  sender: string;
  integrationType: string;
}

export class PostConversation {
  botId: string;
  room: string;
  sender: string;
  humanHandle: boolean;
  integrationType: string;
}
export class ChangeConversation {
  id: string;
  room: string;
  humanHandle: boolean;
  sender: string;
  integrationType: string;
}

export class GetModelConversation {
  integrationType?: string | null;
  userId?: string | null;
  botId?: string | null;
  page: string;
  limit: string;
}

export class JoinRoom {
  room: string;
}

export class SendMessage {
  botId: string;
  room: string;
  sender: string;
  humanHandle: boolean;
  integrationType: string;
  conversationId: string;
  type: string;
  text: string;
  payload?: any;
}

export class PaginationResponseConversation {
  Conversation: Conversation[];
  Pagination: Pagination;
}
