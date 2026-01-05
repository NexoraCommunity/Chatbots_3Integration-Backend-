import { Global, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/service/prisma.service';
import { ValidationService } from './other/validation.service';
import { CryptoService } from './other/crypto.service';
import { VectorStoreService } from '../vector/service/vectoreStore.service';
import { XenovaEmbeddings } from '../embedding/service/xenovaEmbbeding.service';
import { CommonController } from './common.controller';
import { DocumentReaderService } from '../embedding/service/documentReader.service';
import { CommonGateway } from './common.gateway';
import { AuthModule } from '../auth/auth.module';
import {
  redisClient,
  redisPub,
  redisSub,
} from '../redis/service/redis.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [CommonController],
  providers: [
    PrismaService,
    ValidationService,
    CryptoService,
    XenovaEmbeddings,
    VectorStoreService,
    CommonGateway,
    DocumentReaderService,
  ],
  exports: [
    PrismaService,
    ValidationService,
    XenovaEmbeddings,
    CommonGateway,
    CryptoService,
    DocumentReaderService,
    VectorStoreService,
  ],
})
export class CommonModule {}
