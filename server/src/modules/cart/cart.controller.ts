import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { AddCartDto } from './dto/add-cart.dto';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { CartResponseDto } from './dto/cart-response.dto';
import { CartSummaryResponseDto } from './dto/cart-summary-response.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UpdateSelectionDto } from './dto/update-selection.dto';

@Controller('cart')
@UseGuards(JwtSessionGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Serialize(CartResponseDto, 'Get cart successfully.')
  getUserCart(@Req() req) {
    return this.cartService.getUserCart(req.user.sub);
  }

  @Get('/summary')
  @Serialize(CartSummaryResponseDto, 'Get cart summary successfully.')
  getUserCartSummary(@Req() req) {
    return this.cartService.getUserCartSummary(req.user.sub);
  }

  @Post()
  @Serialize(CartResponseDto, 'Item added to cart successfully')
  addToCart(@Req() req, @Body() data: AddCartDto) {
    return this.cartService.addToCart(req.user.sub, data);
  }

  @Patch('/items/:id')
  @Serialize(CartResponseDto, 'Update cart item successfully.')
  updateItemQuantity(
    @Req() req,
    @Param('id') id: string,
    @Body() data: UpdateCartDto,
  ) {
    return this.cartService.updateItemQuantity(req.user.sub, id, data.quantity);
  }

  @Patch('/select-batch')
  @Serialize(CartResponseDto, 'Update cart successfully.')
  updateSelection(@Req() req, @Body() data: UpdateSelectionDto) {
    return this.cartService.updateSelection(req.user.sub, data.cartItemIds);
  }

  @Delete('/items/:id')
  @Serialize(CartResponseDto, 'Remove cart item successfully.')
  removeFromCart(@Req() req, @Param('id') cartItemId: string) {
    return this.cartService.removeFromCart(req.user.sub, cartItemId);
  }

  @Delete('/clear')
  clearCart(@Req() req) {
    return this.cartService.clearUserCart(req.user.id);
  }
}
