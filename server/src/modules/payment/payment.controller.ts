import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MomoIpnDto } from './dto/momo-ipn.dto';
import { verifyMomoIpnSignature } from './momo/momo.util';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post('/momo/ipn')
  async handleMomoIpn(@Body() body: MomoIpnDto) {
    const isValid = verifyMomoIpnSignature(body, process.env.MOMO_SECRET_KEY!);
    if (!isValid) {
      throw new BadRequestException('Invalid signature.');
    }

    const isSuccess = body.resultCode === 0;

    this.eventEmitter.emit('payment.result', {
      orderId: body.orderId,
      isSuccess,
    });

    return { message: 'OK' };
  }

  @Get('/momo/return')
  async handleReturn(@Query() query, @Res() res) {
    this.eventEmitter.emit('payment.result', {
      orderId: query.orderId,
      isSuccess: true,
    });
    return res.redirect('http://localhost:5173/payment/success');
  }
}
