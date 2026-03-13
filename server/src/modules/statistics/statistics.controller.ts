import { Controller, Get, Param, Query, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { StatisticsService } from './statistics.service';
import { RevenueQueryDto } from './dto/revenue-query.dto';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { RolesPermissionsGuard } from 'src/common/guards/rbac.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Serialize } from 'src/common/decorators/serialize.decorator';

@Controller('statistics')
@UseGuards(JwtSessionGuard, RolesPermissionsGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('admin/revenue')
  @Roles(Role.ADMIN)
  @Serialize(null, 'Admin revenue statistics retrieved successfully')
  async getAdminRevenue(@Query() query: RevenueQueryDto) {
    return this.statisticsService.getAdminRevenue(query);
  }

  @Get('admin/revenue/export')
  @Roles(Role.ADMIN)
  async exportAdminRevenue(
    @Query() query: RevenueQueryDto,
    @Res() res: Response,
  ) {
    const data = await this.statisticsService.getAdminRevenue(query);
    const buffer = await this.statisticsService.exportRevenueToExcel(data as any[]);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=admin-revenue-report.xlsx');
    res.send(buffer);
  }

  @Get('shop/:shopId/revenue')
  @Roles(Role.SHOP)
  @Serialize(null, 'Shop revenue statistics retrieved successfully')
  async getShopRevenue(
    @Param('shopId') shopId: string,
    @Query() query: RevenueQueryDto,
    @Req() req,
  ) {
    return this.statisticsService.getShopRevenue(req.user.sub, shopId, query);
  }

  @Get('shop/:shopId/revenue/export')
  @Roles(Role.SHOP)
  async exportShopRevenue(
    @Param('shopId') shopId: string,
    @Query() query: RevenueQueryDto,
    @Req() req,
    @Res() res: Response,
  ) {
    const data = await this.statisticsService.getShopRevenue(req.user.sub, shopId, query);
    const buffer = await this.statisticsService.exportRevenueToExcel(data as any[]);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=shop-${shopId}-revenue-report.xlsx`);
    res.send(buffer);
  }
}
