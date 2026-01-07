import { Injectable } from '@nestjs/common';
import { ConversationWrapper } from 'src/model/aiWrapper.model';
import { ValidationService } from 'src/module/common/other/validation.service';
import { AiWrapperValidation } from '../dto/aiWrapper.validation';
import { ConversationService } from 'src/module/conversation/service/conversation.service';
import { MessageService } from 'src/module/message/service/message.service';
import { UserAgent } from '@prisma/client';
import { CustomerServiceWorkFlow } from '../Workflow/customerService.workflow';

@Injectable()
export class AiService {
  constructor(
    private validationService: ValidationService,
    private messageService: MessageService,
    private conversationService: ConversationService,
    private customerServiceWorkFlow: CustomerServiceWorkFlow,
  ) {}

  async wrapper(req: ConversationWrapper, agent: UserAgent) {
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

    let aiResponse = '';

    if (agent.agent === 'customer-service') {
      aiResponse = await this.customerServiceWorkFlow.workflow(
        agent,
        req.message,
      );
    }

    if (!aiResponse || aiResponse === '') return;
    await this.messageService.addNewMessage({
      role: 'Bot',
      type: 'text',
      conversationId: conversation.id,
      message: String(aiResponse),
    });

    return aiResponse;
  }
}
