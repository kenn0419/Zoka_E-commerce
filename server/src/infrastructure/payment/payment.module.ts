import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentFactory } from './payment.factory';
import { MomoPaymentService } from './momo/momo.service';
import { VnpayPaymentService } from './vnpay/vnpay.service';
import { MomoController } from './momo/momo.controller';

@Module({
  controllers: [MomoController],
  providers: [
    PaymentService,
    PaymentFactory,
    MomoPaymentService,
    VnpayPaymentService,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
