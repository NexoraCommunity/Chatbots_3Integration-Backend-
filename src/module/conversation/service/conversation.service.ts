import { HttpException, Injectable } from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { PrismaService } from 'src/module/common/prisma.service';
import { ValidationService } from 'src/module/common/validation.service';
import {
  ChangeConversation,
  GetModelConversation,
  PaginationResponseConversation,
  PostConversation,
  ConversationApi,
} from 'src/model/conversation.model';
import { ConversationValidation } from '../dto/conversation.validation';

@Injectable()
export class ConversationService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async getConversationByConversationId(
    query: GetModelConversation,
  ): Promise<PaginationResponseConversation> {
    const ConversationValid: GetModelConversation =
      this.validationService.validate(ConversationValidation.Pagination, query);
    if (!ConversationValid) throw new HttpException('Validation Error', 400);
    const { page, limit, integrationType, userId, botId } = ConversationValid;
    if (integrationType == '' || !integrationType)
      throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.conversation.findMany({
      where: {
        integrationType: integrationType,
        userId: String(userId || null),
        botId: String(botId || null),
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const totalData = await this.prismaService.conversation.count();

    return {
      Conversation: data,
      Pagination: {
        page: Number(page),
        pageSize: Number(limit),
        totalItems: totalData,
        totalPages: totalData / Number(limit),
      },
    };
  }
  async getConversation(
    query: GetModelConversation,
  ): Promise<PaginationResponseConversation> {
    const ConversationValid: GetModelConversation =
      this.validationService.validate(ConversationValidation.Pagination, query);
    if (!ConversationValid) throw new HttpException('Validation Error', 400);
    const { page, limit } = ConversationValid;

    const data = await this.prismaService.conversation.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });
    const totalData = await this.prismaService.conversation.count();

    return {
      Conversation: data,
      Pagination: {
        page: Number(page),
        pageSize: Number(limit),
        totalItems: totalData,
        totalPages: totalData / Number(limit),
      },
    };
  }

  async getConversationbyId(id: string): Promise<Conversation> {
    try {
      if (!id) throw new HttpException('Validation Error', 400);

      const data = await this.prismaService.conversation.findFirst({
        where: {
          id: id,
        },
      });

      if (!data) throw new HttpException('Cannot Find Conversation', 403);

      return data;
    } catch (error) {
      throw new HttpException('ConversationId is Invalid', 400);
    }
  }

  async addNewConversation(req: PostConversation): Promise<Conversation> {
    const ConversationValid: PostConversation = this.validationService.validate(
      ConversationValidation.Conversation,
      req,
    );

    if (!ConversationValid) throw new HttpException('Validation Error', 400);

    const checkRoom = await this.prismaService.conversation.findFirst({
      where: {
        room: ConversationValid.room,
      },
    });

    if (checkRoom) return checkRoom;
    const bot = await this.prismaService.bot.findFirst({
      where: {
        id: ConversationValid.botId,
      },
    });

    const data = await this.prismaService.conversation.create({
      data: {
        botId: ConversationValid.botId,
        integrationType: req.integrationType,
        userId: bot?.userId,
        room: ConversationValid.room,
      },
    });

    return data;
  }

  async editConversation(req: ChangeConversation) {
    try {
      const ConversationValid: ChangeConversation =
        this.validationService.validate(
          ConversationValidation.ChangeConversation,
          req,
        );

      if (!ConversationValid) throw new HttpException('Validation Error', 400);
      const data = await this.prismaService.conversation.update({
        where: {
          id: req.id,
        },
        data: ConversationValid,
      });

      const res: ConversationApi = {
        botId: data.botId,
        integrationType: data.integrationType,
        room: data.room,
      };
      return res;
    } catch (error) {
      if (String(error).includes('invalid_type')) throw error;
      throw new HttpException('ConversationId is Invalid', 400);
    }
  }
  async deleteConversation(id: string) {
    if (!id) throw new HttpException('Validation Error', 400);

    try {
      const data = await this.prismaService.conversation.delete({
        where: {
          id: id,
        },
      });
      return true;
    } catch (error) {
      throw new HttpException('ConversationId is Invalid', 400);
    }
  }
}
