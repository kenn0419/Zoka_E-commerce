import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from 'src/common/interfaces/payment.interface';

@Injectable()
export class VnpayPaymentService implements PaymentStrategy {
  async createPayment({ orderId, amount, orderInfo }) {
    const payUrl = 'https://sandbox.vnpayment.vn/payment';
    return { payUrl };
  }
}
