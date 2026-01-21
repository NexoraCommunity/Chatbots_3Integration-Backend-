import { MessageResponse } from './Rag.model';

export class ConversationWrapper {
  room: string;
  integrationType: string;
  message: MessageResponse;
  sender: string;
  botId: string;
  humanHandle: boolean;
}
