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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { CheckoutResponseDto } from './dto/checkout-response.dto';
import { CheckoutPreviewDto } from './dto/checkout-preview.dto';
import { CheckoutPreviewResponseDto } from './dto/checkout-preview-response.dto';
import { CheckoutConfirmDto } from './dto/checkout-confirm.dto';

@Controller('orders')
@UseGuards(JwtSessionGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/checkout/preview')
  @HttpCode(HttpStatus.OK)
  @Serialize(CheckoutPreviewResponseDto, 'Checkout preview successfully!')
  checkoutPreview(@Req() req, @Body() dto: CheckoutPreviewDto) {
    return this.orderService.preview(req.user.sub, dto);
  }

  @Post('/checkout/confirm')
  @Serialize(CheckoutResponseDto, 'Checkout confirm successfully!')
  checkoutConfirm(@Req() req, @Body() dto: CheckoutConfirmDto) {
    return this.orderService.confirm(req.user.sub, dto);
  }
}
