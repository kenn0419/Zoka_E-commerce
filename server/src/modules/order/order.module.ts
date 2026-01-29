import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PaymentModule } from 'src/infrastructure/payment/payment.module';
import { OrderRepository } from './order.repository';
import { CartModule } from '../cart/cart.module';
import { OrderPaymentListener } from './order-payment.listener';
import { OrderCron } from './order.cron';

@Module({
  imports: [PaymentModule, CartModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderPaymentListener, OrderCron],
  exports: [OrderService],
})
export class OrderModule {}
