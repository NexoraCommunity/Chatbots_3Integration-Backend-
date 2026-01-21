import {
  HttpException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';
import { JwtService } from 'src/module/auth/service/jwt.service';
import { PrismaService } from 'src/module/prisma/service/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    private prismaService: PrismaService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token;

    if (!token) throw new HttpException('Unauthorized!!', 401);

    try {
      const isValid = this.jwtService.verificationToken(String(token));

      const user = await this.prismaService.account.findFirst({
        where: {
          accessToken: token,
        },
        include: {
          user: true,
        },
      });

      if (!user) throw new HttpException('Invalid access token!!', 400);

      if (isValid) {
        return next();
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new HttpException('Access token expired!!', 400);
      }
      throw new HttpException('Invalid access token!!', 400);
    }
  }
}
