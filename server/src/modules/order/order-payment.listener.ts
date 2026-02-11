import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderService } from './order.service';

@Injectable()
export class OrderPaymentListener {
  constructor(private readonly orderService: OrderService) {}

  @OnEvent('payment.result')
  async handle(payload: { orderId: string; isSuccess: boolean }) {
    await this.orderService.handlePaymentResult(
      payload.orderId,
      payload.isSuccess,
    );
  }
}
