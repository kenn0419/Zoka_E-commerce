import { Injectable } from '@nestjs/common';
import { MomoPaymentService } from './momo/momo.service';
import { VnpayPaymentService } from './vnpay/vnpay.service';
import { PaymentMethod } from 'src/common/enums/payment.enum';
import { PaymentStrategy } from 'src/common/interfaces/payment.interface';

@Injectable()
export class PaymentFactory {
  constructor(
    private readonly momo: MomoPaymentService,
    private readonly vnpay: VnpayPaymentService,
  ) {}

  getStrategy(method: PaymentMethod): PaymentStrategy {
    switch (method) {
      case PaymentMethod.MOMO:
        return this.momo;
      case PaymentMethod.VNPAY:
        return this.vnpay;
      default:
        throw new Error('Unsupported payment method');
    }
  }
}
