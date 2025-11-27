import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from 'src/module/auth/service/jwt.service';
import { PrismaService } from 'src/module/common/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
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
