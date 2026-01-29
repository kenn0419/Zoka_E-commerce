import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { OrderStatus } from 'src/common/enums/order.enum';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async createOrder(
    data: Prisma.OrderUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return await client.order.create({ data, include: { items: true } });
  }

  findById(orderId: string) {
    return this.prisma.order.findUnique({ where: { id: orderId } });
  }

  updateStatus(
    orderId: string,
    status: OrderStatus,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
