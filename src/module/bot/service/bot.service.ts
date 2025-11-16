import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/common/prisma.service';
import { ValidationService } from 'src/module/common/validation.service';
import {
  BotApi,
  changeBot,
  GetModelbot,
  PaginationResponseBot,
  postBot,
  startBot,
} from 'src/module/model/bot.model';
import { BotValidation } from '../dto/bot.validation';
import { Bot } from '@prisma/client';
import { WhatsaapManagerService } from 'src/module/integrations/whatsaap/whatsaap.service';

@Injectable()
export class BotService {
  constructor(
    private prismaService: PrismaService,
    private readonly validationService: ValidationService,
    private WhatsaapService: WhatsaapManagerService,
  ) {}

  async getBotByUserId(query: GetModelbot): Promise<PaginationResponseBot> {
    const BotValid: GetModelbot = this.validationService.validate(
      BotValidation.Pagination,
      query,
    );
    if (!BotValid) throw new HttpException('Validation Error', 400);
    const { page, limit, userId } = BotValid;
    if (query.userId == '' || !query.userId)
      throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.bot.findMany({
      where: {
        userId: query.userId,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const totalData = await this.prismaService.bot.count();

    return {
      bot: data,
      Pagination: {
        page: Number(page),
        pageSize: Number(limit),
        totalItems: totalData,
        totalPages: totalData / Number(limit),
      },
    };
  }
  async getBot(query: GetModelbot): Promise<PaginationResponseBot> {
    const BotValid: GetModelbot = this.validationService.validate(
      BotValidation.Pagination,
      query,
    );
    if (!BotValid) throw new HttpException('Validation Error', 400);
    const { page, limit } = BotValid;

    const data = await this.prismaService.bot.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });
    const totalData = await this.prismaService.bot.count();

    return {
      bot: data,
      Pagination: {
        page: Number(page),
        pageSize: Number(limit),
        totalItems: totalData,
        totalPages: totalData / Number(limit),
      },
    };
  }

  async getBotbyId(id: string): Promise<Bot> {
    try {
      if (!id) throw new HttpException('Validation Error', 400);

      const data = await this.prismaService.bot.findFirst({
        where: {
          id: id,
        },
      });

      if (!data) throw new HttpException('Cannot Find LLM', 403);

      return data;
    } catch (error) {
      throw new HttpException('BotId is Invalid', 400);
    }
  }

  async addNewBot(req: postBot): Promise<BotApi> {
    const BotValid: postBot = this.validationService.validate(
      BotValidation.Bot,
      req,
    );

    if (!BotValid) throw new HttpException('Validation Error', 400);

    const data = await this.prismaService.bot.create({
      data: BotValid,
    });

    const res: BotApi = {
      bot_name: data.bot_name,
      promptId: data.promptId,
      type: data.type,
      userId: data.userId,
    };

    return res;
  }

  async editBot(req: changeBot) {
    try {
      const BotValid: changeBot = this.validationService.validate(
        BotValidation.changeBot,
        req,
      );

      if (!BotValid) throw new HttpException('Validation Error', 400);
      const data = await this.prismaService.bot.update({
        where: {
          id: req.id,
        },
        data: BotValid,
      });

      const res: BotApi = {
        bot_name: data.bot_name,
        promptId: data.promptId,
        userId: data.userId,
        type: data.type,
      };
      return res;
    } catch (error) {
      if (String(error).includes('invalid_type')) throw error;
      throw new HttpException('BotId is Invalid', 400);
    }
  }

  async startBot(req: startBot) {
    const BotValid: startBot = this.validationService.validate(
      BotValidation.StartBot,
      req,
    );
    if (!BotValid) throw new HttpException('Validation Error', 400);
    const bot = await this.prismaService.bot.findFirst({
      where: {
        id: BotValid.botId,
      },
    });

    if (!bot) throw new HttpException('Bot id not Found!!', 400);
  }
  async deleteBot(id: string) {
    if (!id) throw new HttpException('Validation Error', 400);

    try {
      const data = await this.prismaService.bot.delete({
        where: {
          id: id,
        },
      });
      return true;
    } catch (error) {
      throw new HttpException('BotId is Invalid', 400);
    }
  }
}
