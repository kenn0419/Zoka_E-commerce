import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CheckoutDto } from './dto/checkout.dto';
import { Cart, Prisma } from 'generated/prisma';
import { PaymentMethod } from 'src/common/enums/payment.enum';
import ms from 'ms';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { OrderStatus } from 'src/common/enums/order.enum';
import { PaymentService } from 'src/infrastructure/payment/payment.service';
import { CartRepository } from '../cart/repositories/cart.repository';

type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private readonly paymentService: PaymentService,
    private readonly orderRepo: OrderRepository,
    private readonly cartRepo: CartRepository,
  ) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const cart = await this.cartRepo.findUnique(userId);
    if (!cart) {
      throw new BadRequestException('Cart not initialized!');
    }
    const order = await this.createOrder(userId, cart, dto.paymentMethod);

    if (dto.paymentMethod !== PaymentMethod.COD) {
      const payment = await this.paymentService.createPayment(
        dto.paymentMethod,
        {
          orderId: order.id,
          amount: Number(order.totalPrice),
          orderInfo: `Order ${order.id}`,
        },
      );

      return {
        orderId: order.id,
        payUrl: payment.payUrl,
      };
    }

    return { orderId: order.id };
  }

  async handlePaymentResult(orderId: string, isSuccess: boolean) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      return;
    }

    if (order.status !== OrderStatus.PENDING) {
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      await this.orderRepo.updateStatus(
        order.id,
        isSuccess ? OrderStatus.PAID : OrderStatus.CANCELLED,
        tx,
      );

      await this.cartRepo.clearCartByUserId(order.buyerId);
    });
  }

  private async createOrder(
    userId: string,
    cart: CartWithItems,
    paymentMethod: PaymentMethod,
  ) {
    const expiresAt = new Date(Date.now() + ms('15m'));

    return this.prisma.$transaction(async (tx) => {
      const payload = {
        buyerId: userId,
        shopId: cart.items[0].product.shopId,
        totalPrice: cart.items.reduce(
          (cur, next) => cur + Number(next.priceSnapshot),
          0,
        ),
        paymentMethod,
        status: OrderStatus.PENDING,
        expiresAt,
        items: {
          create: cart.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.priceSnapshot,
          })),
        },
      };
      return this.orderRepo.createOrder(payload, tx);
    });
  }
}
