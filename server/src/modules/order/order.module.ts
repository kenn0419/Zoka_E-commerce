import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { OrderRepository } from './order.repository';
import { CartModule } from '../cart/cart.module';
import { OrderPaymentListener } from './order-payment.listener';
import { OrderCron } from './order.cron';
import { CouponModule } from '../coupon/coupon.module';
import { AddressModule } from '../address/address.module';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports: [PaymentModule, CartModule, CouponModule, AddressModule, ShopModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderPaymentListener, OrderCron],
  exports: [OrderService],
})
export class OrderModule {}
