import { Injectable } from '@nestjs/common';
import { ConversationWrapper } from 'src/model/aiWrapper.model';
import { ValidationService } from 'src/module/common/validation.service';
import { GroqService } from 'src/module/llm/LlmService/groq.service';
import { AiWrapperValidation } from '../dto/aiWrapper.validation';
import { ConversationService } from 'src/module/conversation/service/conversation.service';
import { MessageService } from 'src/module/message/service/message.service';

@Injectable()
export class AiService {
  constructor(
    private validationService: ValidationService,
    private messageService: MessageService,
    private groqService: GroqService,
    private conversationService: ConversationService,
  ) {}

  async wrapper(req: ConversationWrapper) {
    const ReqValid: ConversationWrapper = this.validationService.validate(
      AiWrapperValidation.aiWrapper,
      req,
    );

    if (!ReqValid) return;

    const conversation =
      await this.conversationService.addNewConversation(ReqValid);

    await this.messageService.addNewMessage({
      role: 'user',
      type: 'text',
      conversationId: conversation.id,
      message: ReqValid.message,
    });

    const aiResponse = await this.groqService.createCompletions(
      ReqValid.message,
    );

    if (!aiResponse || aiResponse === '') return;
    await this.messageService.addNewMessage({
      role: 'Bot',
      type: 'text',
      conversationId: conversation.id,
      message: aiResponse,
    });

    return aiResponse;
  }
}
