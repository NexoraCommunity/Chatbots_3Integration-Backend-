import { Module } from '@nestjs/common';
import { UserIntegrationController } from './userIntegration.controller';
import { UserIntegrationService } from './service/userIntegration.service';

@Module({
  imports: [],
  controllers: [UserIntegrationController],
  providers: [UserIntegrationService],
  exports: [UserIntegrationService],
})
export class userIntegrationModule {}
