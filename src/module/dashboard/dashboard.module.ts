import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './service/dashboard.service';

@Module({
  imports: [],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [],
})
export class DashboardModule {}
