import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/common/prisma.service';
import { ValidationService } from 'src/module/common/validation.service';
import {
  BotApi,
  botStatus,
  changeBot,
  GetModelbot,
  PaginationResponseBot,
  postBot,
  startBot,
} from 'src/model/bot.model';
import { BotValidation } from '../dto/bot.validation';
import { Bot } from '@prisma/client';

@Injectable()
export class BotService {
  constructor(
    private prismaService: PrismaService,
    private readonly validationService: ValidationService,
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

      if (!data) throw new HttpException('Cannot Find Bot', 403);

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

    const res: Bot = data;

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

      const res: Bot = data;
      return res;
    } catch (error) {
      if (String(error).includes('invalid_type')) throw error;
      throw new HttpException('BotId is Invalid', 400);
    }
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

  async updateBotStatus(req: botStatus, status: boolean) {
    await this.prismaService.bot.update({
      where: {
        id: req.botId,
      },
      data: {
        is_active: status,
        data: req.data,
        numberPhoneWaba: req.numberPhoneWaba,
      },
    });
  }
}
