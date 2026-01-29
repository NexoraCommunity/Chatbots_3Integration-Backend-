import { Global, Module } from '@nestjs/common';
import { SubscribtionController } from './subcribtion.controller';
import { SubscribtionService } from './service/subcribtion.service';

@Global()
@Module({
  imports: [],
  controllers: [SubscribtionController],
  providers: [SubscribtionService],
})
export class SubcribtionModule {}
