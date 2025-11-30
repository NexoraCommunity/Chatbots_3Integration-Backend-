import { Module } from '@nestjs/common';
import { UserIntegrationController } from './userIntegration.controller';
import { UserIntegrationService } from './service/userIntegration.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserIntegrationController],
  providers: [UserIntegrationService],
})
export class userIntegrationModule {}
