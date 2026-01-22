import { HttpException, Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/service/prisma.service';
import { ValidationService } from 'src/module/common/other/validation.service';
import {
  ChangeMessage,
  GetModelMessage,
  PaginationResponseMessage,
  PostMessage,
  MessageApi,
} from 'src/model/message.model';
import { MessageValidation } from '../dto/message.validation';
import { toPrismaJson } from 'src/model/contentIntegrations.model';
import { MessageResponse } from 'src/model/Rag.model';

@Injectable()
export class MessageService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getMessageByConversationId(
    query: GetModelMessage,
  ): Promise<PaginationResponseMessage> {
    const MessageValid: GetModelMessage = this.validationService.validate(
      MessageValidation.Pagination,
      query,
    );
    if (!MessageValid) throw new HttpException('Validation Error', 400);
    const { page, limit, conversationId } = MessageValid;
    if (query.conversationId == '' || !query.conversationId)
      throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.message.findMany({
      where: {
        conversationId: conversationId,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const totalData = await this.prismaService.message.count({
      where: {
        conversationId: conversationId,
      },
    });

    return {
      message: data,
      Pagination: {
        page: Number(page),
        pageSize: Number(limit),
        totalItems: totalData,
        totalPages: totalData / Number(limit),
      },
    };
  }
  async getMessage(query: GetModelMessage): Promise<PaginationResponseMessage> {
    const MessageValid: GetModelMessage = this.validationService.validate(
      MessageValidation.Pagination,
      query,
    );
    if (!MessageValid) throw new HttpException('Validation Error', 400);
    const { page, limit } = MessageValid;

    const data = await this.prismaService.message.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });
    const totalData = await this.prismaService.message.count();

    return {
      message: data,
      Pagination: {
        page: Number(page),
        pageSize: Number(limit),
        totalItems: totalData,
        totalPages: totalData / Number(limit),
      },
    };
  }

  async getMessagebyId(id: string): Promise<Message> {
    try {
      if (!id) throw new HttpException('Validation Error', 400);

      const data = await this.prismaService.message.findFirst({
        where: {
          id: id,
        },
      });

      if (!data) throw new HttpException('Cannot Find Message', 403);

      return data;
    } catch (error) {
      throw new HttpException('MessageId is Invalid', 400);
    }
  }

  async addNewMessage(req: PostMessage): Promise<MessageApi> {
    const MessageValid: PostMessage = this.validationService.validate(
      MessageValidation.Message,
      req,
    );

    if (!MessageValid) throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.message.create({
      data: { ...MessageValid, message: toPrismaJson(MessageValid.message) },
    });

    const res: MessageApi = {
      message: data.message as unknown as MessageResponse,
      conversationId: data.conversationId,
      type: data.type,
      role: data.role,
    };

    return res;
  }

  async editMessage(req: ChangeMessage) {
    try {
      const MessageValid: ChangeMessage = this.validationService.validate(
        MessageValidation.chageMessage,
        req,
      );

      if (!MessageValid) throw new HttpException('Validation Error', 400);
      const data = await this.prismaService.message.update({
        where: {
          id: req.id,
        },
        data: { ...MessageValid, message: toPrismaJson(MessageValid.message) },
      });

      const res: MessageApi = {
        message: data.message as unknown as MessageResponse,
        conversationId: data.conversationId,
        type: data.type,
        role: data.role,
      };
      return res;
    } catch (error) {
      if (String(error).includes('invalid_type')) throw error;
      throw new HttpException('MessageId is Invalid', 400);
    }
  }
  async deleteMessage(id: string) {
    if (!id) throw new HttpException('Validation Error', 400);

    try {
      const data = await this.prismaService.message.delete({
        where: {
          id: id,
        },
      });
      return true;
    } catch (error) {
      throw new HttpException('MessageId is Invalid', 400);
    }
  }
}
