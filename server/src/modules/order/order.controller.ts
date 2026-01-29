import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { CheckoutDto } from './dto/checkout.dto';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { CheckoutResponseDto } from './dto/checkout-response.dto';

@Controller('orders')
@UseGuards(JwtSessionGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/checkout')
  @Serialize(CheckoutResponseDto, 'Checkout successfully!')
  checkout(@Req() req, @Body() dto: CheckoutDto) {
    return this.orderService.checkout(req.user.sub, dto);
  }
}
