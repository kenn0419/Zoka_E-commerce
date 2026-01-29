import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { OrderStatus } from 'src/common/enums/order.enum';

@Injectable()
export class OrderCron {
  private readonly logger = new Logger(OrderCron.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async cancelExpiredOrders() {
    const now = new Date();

    const result = await this.prisma.order.updateMany({
      where: {
        status: OrderStatus.PENDING,
        expiresAt: { lt: now },
      },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    if (result.count > 0) {
      this.logger.log(`Auto-cancelled ${result.count} orders`);
    }
  }
}
