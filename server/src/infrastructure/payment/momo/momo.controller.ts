import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { verifyMomoIpnSignature } from './momo.util';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('payment/momo')
export class MomoController {
  constructor(private readonly eventEmmitter: EventEmitter2) {}

  @Post('ipn')
  async handleIpn(@Body() body: any) {
    const isValid = verifyMomoIpnSignature(body, process.env.MOMO_SECRET_KEY!);
    if (!isValid) {
      throw new BadRequestException('Invalid signature.');
    }

    const isSuccess = body.resultCode === 0;

    this.eventEmmitter.emit('payment.result', {
      orderId: body.orderId,
      isSuccess,
    });
    console.log('Sended event emitter');

    return { message: 'OK' };
  }

  @Get('return')
  async handleReturn(@Query() query, @Res() res) {
    this.eventEmmitter.emit('payment.result', {
      orderId: query.orderId,
      isSuccess: true,
    });
    return res.redirect('http://localhost:5173/payment/success');
  }
}
