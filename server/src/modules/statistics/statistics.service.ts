import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { RevenueQueryDto, StatisticsPeriod } from './dto/revenue-query.dto';
import * as ExcelJS from 'exceljs';
import { RedisService } from 'src/infrastructure/redis/redis.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getAdminRevenue(query: RevenueQueryDto) {
    const { period, startDate, endDate } = query;
    const truncType = this.getTruncType(period);

    let dateFilter = '';
    if (startDate && endDate) {
      dateFilter = `AND "createdAt" BETWEEN '${startDate}' AND '${endDate}'`;
    }

    const cacheKey = `stat:admin:revenue:${period}:${startDate || 'none'}:${endDate || 'none'}`;

    return this.redisService.getOrSet(
      cacheKey,
      async () => {
        return this.prisma.$queryRawUnsafe(`
          WITH period_stats AS (
            SELECT 
              DATE_TRUNC('${truncType}', "createdAt") AS period_date,
              SUM("totalPrice") AS revenue
            FROM "Order"
            WHERE status = 'COMPLETED' ${dateFilter}
            GROUP BY 1
          )
          SELECT 
            period_date AS date,
            revenue::FLOAT,
            SUM(revenue) OVER (ORDER BY period_date)::FLOAT AS "cumulativeRevenue",
            LAG(revenue) OVER (ORDER BY period_date)::FLOAT AS "previousRevenue",
            CASE 
              WHEN LAG(revenue) OVER (ORDER BY period_date) = 0 OR LAG(revenue) OVER (ORDER BY period_date) IS NULL THEN NULL
              ELSE ((revenue - LAG(revenue) OVER (ORDER BY period_date)) / LAG(revenue) OVER (ORDER BY period_date) * 100)::FLOAT 
            END AS "growthPercentage"
          FROM period_stats
          ORDER BY period_date ASC;
        `);
      },
      60 * 15, // 15 minutes TTL
    );
  }

  async getShopRevenue(userId: string, shopId: string, query: RevenueQueryDto) {
    const { period, startDate, endDate } = query;
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
      select: { ownerId: true },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    if (shop.ownerId !== userId) {
      throw new ForbiddenException('You are not allowed to view statistics for this shop');
    }

    const truncType = this.getTruncType(period);

    let dateFilter = '';
    if (startDate && endDate) {
      dateFilter = `AND "createdAt" BETWEEN '${startDate}' AND '${endDate}'`;
    }

    const cacheKey = `stat:shop:revenue:${shopId}:${period}:${startDate || 'none'}:${endDate || 'none'}`;

    return this.redisService.getOrSet(
      cacheKey,
      async () => {
        return this.prisma.$queryRawUnsafe(`
          WITH period_stats AS (
            SELECT 
              DATE_TRUNC('${truncType}', "createdAt") AS period_date,
              SUM("totalPrice") AS revenue
            FROM "Order"
            WHERE status = 'COMPLETED' AND "shopId" = '${shopId}' ${dateFilter}
            GROUP BY 1
          )
          SELECT 
            period_date AS date,
            revenue::FLOAT,
            SUM(revenue) OVER (ORDER BY period_date)::FLOAT AS "cumulativeRevenue",
            LAG(revenue) OVER (ORDER BY period_date)::FLOAT AS "previousRevenue",
            CASE 
              WHEN LAG(revenue) OVER (ORDER BY period_date) = 0 OR LAG(revenue) OVER (ORDER BY period_date) IS NULL THEN NULL
              ELSE ((revenue - LAG(revenue) OVER (ORDER BY period_date)) / LAG(revenue) OVER (ORDER BY period_date) * 100)::FLOAT 
            END AS "growthPercentage"
          FROM period_stats
          ORDER BY period_date ASC;
        `);
      },
      60 * 15, // 15 minutes TTL
    );
  }

  async exportRevenueToExcel(data: any[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Revenue Report');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Revenue', key: 'revenue', width: 15 },
      { header: 'Cumulative Revenue', key: 'cumulativeRevenue', width: 20 },
      { header: 'Growth (%)', key: 'growthPercentage', width: 15 },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        date: item.date,
        revenue: item.revenue,
        cumulativeRevenue: item.cumulativeRevenue,
        growthPercentage: item.growthPercentage ? `${item.growthPercentage.toFixed(2)}%` : '0%',
      });
    });

    return workbook.xlsx.writeBuffer();
  }

  private getTruncType(period: StatisticsPeriod): string {
    switch (period) {
      case StatisticsPeriod.MONTH:
        return 'month';
      case StatisticsPeriod.YEAR:
        return 'year';
      default:
        return 'day';
    }
  }
}
