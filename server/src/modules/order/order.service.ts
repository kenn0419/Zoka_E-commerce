import {
  Address,
  Coupon,
  Order,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from 'generated/prisma';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import ms from 'ms';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { PaymentRepository } from '../payment/payment.repository';
import { OrderRepository } from './order.repository';
import { CartItemRepository } from '../cart/repositories/cart-item.repository';
import { AddressRepository } from '../address/address.repository';
import { CouponRepository } from '../coupon/repositories/coupon.repository';

import { OrderSort, OrderStatus } from 'src/common/enums/order.enum';
import {
  CouponScope,
  CouponStatus,
  CouponType,
} from 'src/common/enums/coupon.enum';
import { mapMethodToProvider } from 'src/common/mappers/map-method-to-provider';
import { groupByMap } from 'src/common/utils/group-by.util';

import { CheckoutPreviewDto } from './dto/checkout-preview.dto';
import { CheckoutConfirmDto } from './dto/checkout-confirm.dto';
import { CartItemWithProduct } from './types/cart-item-with-product.type';
import { CalculatedShopOrder } from './types/calculated-shop-order.type';
import { OrderQueryDto } from './dto/order-query.dto';
import { paginatedResult } from 'src/common/utils/pagninated-result.util';
import { buildOrderSort } from 'src/common/utils/order-sort.util';
import { ShopRepository } from '../shop/shop.repository';
import { generateOrderCode } from 'src/common/utils/generate-order-code.util';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
    private readonly paymentRepo: PaymentRepository,
    private readonly orderRepo: OrderRepository,
    private readonly cartItemRepo: CartItemRepository,
    private readonly couponRepo: CouponRepository,
    private readonly addressRepo: AddressRepository,
    private readonly shopRepo: ShopRepository,
  ) {}

  async preview(userId: string, dto: CheckoutPreviewDto) {
    const cartItems = await this.loadAndValidateCartItems(userId);

    const address = await this.addressRepo.findDefaultByUserId(userId);

    const coupons = await this.couponRepo.findCouponsForCheckoutPreview(
      userId,
      cartItems,
    );

    let appliedCoupon: Coupon | null = null;

    if (dto.couponCode) {
      appliedCoupon = await this.validateCouponAvailability(
        userId,
        dto.couponCode,
      );
    }

    const shopOrders = this.calculateShopOrders(cartItems, appliedCoupon);

    const summary = this.calculateSummary(shopOrders);

    return {
      shops: shopOrders,
      summary,
      address,
      coupons,
    };
  }

  async confirm(userId: string, dto: CheckoutConfirmDto) {
    const cartItems =
      await this.cartItemRepo.getSelectedCartItemsByUser(userId);

    if (!cartItems.length) {
      throw new BadRequestException('Invalid cart items');
    }

    const address = await this.addressRepo.findDefaultByUserId(userId);
    if (!address) {
      throw new BadRequestException('Address not found');
    }

    const coupon = dto.couponCode
      ? await this.validateCouponAvailability(userId, dto.couponCode)
      : null;

    const shopOrders = this.calculateShopOrders(cartItems, coupon);
    const totalAmount = shopOrders.reduce((s, i) => s + i.total, 0);

    let payment: Payment | null = null;
    const orders: Order[] = [];

    await this.prisma.$transaction(async (tx) => {
      await this.decrementStock(cartItems, tx);

      if (dto.paymentMethod !== PaymentMethod.COD) {
        const provider = mapMethodToProvider(dto.paymentMethod);

        payment = await this.paymentRepo.create(provider!, totalAmount, tx);
      }

      for (const shopOrder of shopOrders) {
        const note =
          dto.shopNotes?.find((n) => n.shopId === shopOrder.shopId)?.note ??
          null;

        const order = await this.createOrderTx(
          userId,
          shopOrder,
          dto.paymentMethod,
          address,
          coupon,
          payment?.id ?? null,
          note,
          tx,
        );
        orders.push(order);
      }

      if (coupon) {
        await this.couponRepo.markUsed(userId, coupon.id, tx);
      }

      const cartItemIds = cartItems.map((i) => i.id);
      await this.cartItemRepo.removeItemByIds(userId, cartItemIds, tx);
    });

    if (dto.paymentMethod === PaymentMethod.COD) {
      return { orderIds: orders.map((o) => o.id) };
    }

    const payRes = await this.paymentService.createPayment(dto.paymentMethod, {
      paymentId: payment!.id,
      amount: Number(payment!.amount),
      orderInfo: `Payment ${payment!.id}`,
    });

    return {
      paymentId: payment!.id,
      orderIds: orders.map((o) => o.id),
      payUrl: payRes.payUrl,
    };
  }

  async handlePaymentResult(paymentId: string, success: boolean) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        orders: {
          include: { items: true },
        },
      },
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    if (payment.status !== PaymentStatus.PENDING) {
      return;
    }
    const couponId = payment.orders.find((o) => o.couponId)?.couponId;
    const hasExpiredOrder = payment.orders.some(
      (o) => o.status === OrderStatus.CANCELLED,
    );

    if (hasExpiredOrder) {
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      if (success) {
        await tx.payment.update({
          where: { id: paymentId },
          data: { status: PaymentStatus.SUCCESS },
        });

        await tx.order.updateMany({
          where: { paymentId, status: OrderStatus.PENDING },
          data: {
            status: OrderStatus.PAID,
            expiresAt: null,
          },
        });

        if (couponId) {
          await tx.coupon.update({
            where: { id: couponId },
            data: { usedCount: { increment: 1 } },
          });
        }
      } else {
        await tx.payment.update({
          where: { id: paymentId },
          data: { status: PaymentStatus.FAILED },
        });

        for (const order of payment.orders) {
          await tx.order.update({
            where: { id: order.id },
            data: { status: OrderStatus.CANCELLED },
          });

          for (const item of order.items) {
            if (!item.variantId) continue;

            await tx.productVariant.update({
              where: { id: item.variantId },
              data: {
                stock: { increment: item.quantity },
              },
            });
          }
        }

        const buyerId = payment.orders[0]?.buyerId;

        if (couponId) {
          await this.couponRepo.rollbackUsed(buyerId, couponId, tx);
        }
      }
    });
  }

  async findAllMyOrders(userId: string, data: OrderQueryDto) {
    const where: Prisma.OrderWhereInput = {
      buyerId: userId,
    };

    const result = paginatedResult(
      {
        where,
        page: data.page,
        limit: data.limit,
        orderBy: buildOrderSort(OrderSort.OLDEST),
      },
      (args) => this.orderRepo.listPaginatedOrders(args),
    );

    return result;
  }

  async findShopOrders(userId: string, shopId: string, query: OrderQueryDto) {
    const shop = await this.shopRepo.findUnique({ id: shopId });
    const isOwner = shop?.ownerId === userId;
    if (!isOwner) {
      throw new BadRequestException(`You don't have permission to access.`);
    }

    const where: Prisma.OrderWhereInput = {
      shopId: shop.id,
    };

    const result = paginatedResult(
      {
        where,
        page: query.page,
        limit: query.page,
        orderBy: buildOrderSort(query.sort),
      },
      (args) => this.orderRepo.listPaginatedOrders(args),
    );

    return result;
  }

  async findAllOrders(query: OrderQueryDto) {
    const where: Prisma.OrderWhereInput = {};

    const result = paginatedResult(
      {
        where,
        page: query.page,
        limit: query.page,
        orderBy: buildOrderSort(query.sort),
      },
      (args) => this.orderRepo.listPaginatedOrders(args),
    );

    return result;
  }

  async changeOrderStatusByShop(
    userId: string,
    orderCode: string,
    status: OrderStatus,
  ) {
    const order = await this.orderRepo.findUnique({ code: orderCode });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.shop.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to change this order status',
      );
    }

    return this.orderRepo.updateOrder(order.id, status);
  }

  async changeOrderStatusByAdmin(orderId: string, status: OrderStatus) {
    const order = await this.orderRepo.findUnique({ id: orderId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.orderRepo.updateOrder(order.id, status);
  }

  private async loadAndValidateCartItems(userId: string) {
    const cartItems =
      await this.cartItemRepo.getSelectedCartItemsByUser(userId);

    if (!cartItems.length) {
      throw new BadRequestException('Cart items not found');
    }

    for (const item of cartItems) {
      if (item.quantity > item.stockSnapshot) {
        throw new BadRequestException(`Out of stock: ${item.productName}`);
      }
    }

    return cartItems;
  }

  private async validateCouponAvailability(
    userId: string,
    code: string,
  ): Promise<Coupon> {
    const coupon = await this.couponRepo.findByCode(code);

    if (!coupon || coupon.status !== CouponStatus.ACTIVE) {
      throw new BadRequestException('Invalid coupon');
    }

    const now = new Date();
    if (
      (coupon.startAt && coupon.startAt > now) ||
      (coupon.endAt && coupon.endAt < now)
    ) {
      throw new BadRequestException('Coupon expired');
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    const hasUsed = await this.couponRepo.hasUserUsed(userId, coupon.id);
    if (hasUsed) {
      throw new BadRequestException('Coupon already used');
    }

    return coupon;
  }

  private calculateDiscount(coupon: Coupon, subtotal: number) {
    let discount =
      coupon.type === CouponType.PERCENTAGE
        ? (subtotal * Number(coupon.discount)) / 100
        : Number(coupon.discount);

    if (coupon.maxDiscount) {
      discount = Math.min(discount, Number(coupon.maxDiscount));
    }

    return Math.max(0, discount);
  }

  private calculateShopOrders(
    cartItems: CartItemWithProduct[],
    coupon: Coupon | null,
  ): CalculatedShopOrder[] {
    const shopMap = groupByMap(cartItems, (i) => i.product.shopId);
    const result: CalculatedShopOrder[] = [];

    const totalSubtotal = cartItems.reduce(
      (s, i) => s + Number(i.priceSnapshot) * i.quantity,
      0,
    );

    let remainingGlobalDiscount = 0;

    if (coupon?.scope === CouponScope.GLOBAL) {
      if (coupon.minOrder && totalSubtotal < Number(coupon.minOrder)) {
        throw new BadRequestException('Order not eligible for coupon');
      }
      remainingGlobalDiscount = this.calculateDiscount(coupon, totalSubtotal);
    }

    for (const [shopId, items] of shopMap.entries()) {
      const subtotal = items.reduce(
        (s, i) => s + Number(i.priceSnapshot) * i.quantity,
        0,
      );

      let discount = 0;

      if (coupon?.scope === CouponScope.SHOP && coupon.shopId === shopId) {
        if (coupon.minOrder && subtotal < Number(coupon.minOrder)) {
          throw new BadRequestException('Order not eligible for coupon');
        }
        discount = this.calculateDiscount(coupon, subtotal);
      }

      if (coupon?.scope === CouponScope.GLOBAL && remainingGlobalDiscount > 0) {
        const maxDiscountForShop = this.calculateDiscount(coupon, subtotal);

        discount = Math.min(subtotal, maxDiscountForShop);
        remainingGlobalDiscount -= discount;
      }

      const shippingFee = subtotal > 500_000 ? 0 : 30_000;
      const total = subtotal + shippingFee - discount;

      result.push({
        shopId,
        items,
        subtotal,
        shippingFee,
        discount,
        total,
      });
    }

    return result;
  }

  private calculateSummary(shops: CalculatedShopOrder[]) {
    return {
      subtotal: shops.reduce((s, i) => s + i.subtotal, 0),
      shippingFee: shops.reduce((s, i) => s + i.shippingFee, 0),
      discount: shops.reduce((s, i) => s + i.discount, 0),
      total: shops.reduce((s, i) => s + i.total, 0),
    };
  }

  private async decrementStock(
    cartItems: CartItemWithProduct[],
    tx: Prisma.TransactionClient,
  ) {
    for (const item of cartItems) {
      const { count } = await tx.productVariant.updateMany({
        where: {
          id: item.variantId,
          stock: { gte: item.quantity },
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (count === 0) {
        throw new BadRequestException(`Out of stock: ${item.productName}`);
      }
    }
  }

  private async createOrderTx(
    userId: string,
    shopOrder: CalculatedShopOrder,
    paymentMethod: PaymentMethod,
    address: Address,
    coupon: Coupon | null,
    paymentId: string | null,
    note: string | null,
    tx: Prisma.TransactionClient,
  ) {
    return this.orderRepo.createOrder(
      {
        code: generateOrderCode(),
        buyerId: userId,
        shopId: shopOrder.shopId,
        subtotal: shopOrder.subtotal,
        shippingFee: shopOrder.shippingFee,
        discount: shopOrder.discount,
        totalPrice: shopOrder.total,
        couponId: coupon?.id ?? null,
        paymentId,
        receiverName: address.receiverName,
        receiverPhone: address.receiverPhone,
        addressText: address.addressText,
        paymentMethod,
        note,
        status: OrderStatus.PENDING,
        expiresAt:
          paymentMethod === PaymentMethod.COD
            ? null
            : new Date(Date.now() + ms('15m')),
        items: {
          create: shopOrder.items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            productName: i.productName,
            variantName: i.variantName,
            imageUrl: i.imageUrl,
            price: i.priceSnapshot,
            quantity: i.quantity,
          })),
        },
      },
      tx,
    );
  }
}
