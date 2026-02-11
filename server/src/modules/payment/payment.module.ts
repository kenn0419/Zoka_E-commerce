import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentFactory } from './payment.factory';
import { MomoPaymentService } from './momo/momo.service';
import { VnpayPaymentService } from './vnpay/vnpay.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './payment.repository';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentFactory,
    MomoPaymentService,
    VnpayPaymentService,
    PaymentRepository,
  ],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
