import { Module } from '@nestjs/common';
import { ContentIntegrationController } from './contentIntegration.controller';
import { ContentIntegrationService } from './service/contentIntegration.service';

@Module({
  imports: [],
  controllers: [ContentIntegrationController],
  providers: [ContentIntegrationService],
})
export class ContentIntegrationModule {}
