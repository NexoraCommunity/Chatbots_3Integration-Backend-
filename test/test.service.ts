import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/common/prisma.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class testService {
  constructor(private prismaService: PrismaService) {}

  // Auth Service Test
  async DeleteTestUser() {
    const user = await this.prismaService.user.findFirst({
      where: { email: 'testnexoraoraora@gmail.com' },
    });

    if (!user) return;
    await this.prismaService.account.deleteMany({
      where: {
        providerAccountId: 'testnexoraoraora@gmail.com',
      },
    });
    await this.prismaService.userOtp.deleteMany({
      where: {
        userId: user?.id,
      },
    });
    await this.prismaService.message.deleteMany({
      where: {
        message: 'test',
      },
    });
    await this.prismaService.conversation.deleteMany({
      where: {
        room: 'testtust',
      },
    });
    await this.prismaService.bot.deleteMany({
      where: {
        bot_name: 'test',
      },
    });
    await this.prismaService.prompt.deleteMany({
      where: {
        name: 'test',
      },
    });
    await this.prismaService.user.delete({
      where: {
        email: 'testnexoraoraora@gmail.com',
      },
    });
  }

  async GetOTPUser() {
    const findOTP = await this.prismaService.user.findFirst({
      where: {
        email: 'testnexoraoraora@gmail.com',
      },
      include: {
        userOtp: {
          where: {
            isUsed: false,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        authProvider: true,
      },
    });

    if (!findOTP || findOTP.userOtp.length === 0) {
      return null;
    }

    return findOTP;
  }

  async AddNewExpiredOTP(userID: string) {
    await this.prismaService.userOtp.create({
      data: {
        expiresAt: new Date(Date.now() - 60 * 60 * 1000),
        otpCode: '109109',
        userId: userID,
      },
    });
  }

  async getRefreshToken() {
    const refreshToken = await this.prismaService.account.findFirst({
      where: {
        providerAccountId: 'testnexoraoraora@gmail.com',
      },
    });

    return refreshToken?.refreshToken;
  }

  async getAccessToken() {
    const refreshToken = await this.prismaService.account.findFirst({
      where: {
        providerAccountId: 'testnexoraoraora@gmail.com',
      },
    });

    return refreshToken?.accessToken;
  }

  async getUser() {
    const data = await this.prismaService.user.findFirst({
      where: {
        email: 'testnexoraoraora@gmail.com',
      },
    });

    return data;
  }

  // Prompt test service

  async getPrompt() {
    const data = await this.prismaService.prompt.findFirst({
      where: {
        name: 'test',
      },
    });
    return data;
  }

  // Conversation Test Service
  async getConversation() {
    const data = await this.prismaService.conversation.findFirst({
      where: {
        room: 'testtust',
      },
    });
    return data;
  }

  // Bot Test Service
  async getBot() {
    const data = await this.prismaService.bot.findFirst({
      where: {
        bot_name: 'test',
      },
    });
    return data;
  }

  // Messge Test Service
  async getMessage() {
    const data = await this.prismaService.message.findFirst({
      where: {
        message: 'test',
      },
    });
    return data;
  }
}
