import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { DashboardModel, QueryDashboard } from 'src/model/dashboard.model';
import { WebResponse } from 'src/model/web.model';
import { DashboardService } from './service/dashboard.service';

@Controller('api')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}
  @Get('/dashboard')
  @HttpCode(200)
  async getDashboard(
    @Query() query: QueryDashboard,
  ): Promise<WebResponse<DashboardModel>> {
    const data = await this.dashboardService.getDashboard(query);
    return {
      data: data,
      status: '200',
    };
  }
}
