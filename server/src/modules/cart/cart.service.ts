import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddCartDto } from './dto/add-cart.dto';
import { CartRepository } from './repositories/cart.repository';
import { ProductVariantRepository } from '../product/repositories/product-variant.repository';
import { CartItemRepository } from './repositories/cart-item.repository';
import { CartMapper } from 'src/common/mappers/cart.mapper';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    private cartRepo: CartRepository,
    private cartItemRepo: CartItemRepository,
    private productVariantRepo: ProductVariantRepository,
  ) {}

  private async getOrCreateCartEntity(userId: string) {
    const cart = await this.cartRepo.getOrCreateCartByUser(userId);
    return cart;
  }

  async getUserCart(userId: string) {
    const cart = await this.getOrCreateCartEntity(userId);
    return CartMapper.toCartResponse(cart);
  }

  async getUserCartSummary(userId: string) {
    const cart = await this.getOrCreateCartEntity(userId);
    const cartItems = CartMapper.toCartItemResponses(cart);
    return CartMapper.toCartSummaryResponse(cartItems);
  }

  async addToCart(userId: string, data: AddCartDto) {
    const existVariant = await this.productVariantRepo.findUnique({
      id: data.variantId,
    });
    if (!existVariant) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.getOrCreateCartEntity(userId);

    const existItem = cart?.items.find(
      (item) =>
        item.productId === existVariant.productId &&
        item.variantId === data.variantId,
    );
    if (existItem) {
      const currentQuantity = existItem?.quantity ?? 0;
      if (currentQuantity + data.quantity > existVariant.stock) {
        throw new NotFoundException(
          'Insufficient stock for the requested product variant',
        );
      }
      const newQuantity = existItem.quantity + data.quantity;
      await this.cartItemRepo.updateQuantity(existItem.id, {
        quantity: newQuantity,
      });
    } else {
      const payload = {
        cartId: cart.id,
        productId: existVariant.productId,
        variantId: data.variantId,
        productName: existVariant.product.name,
        variantName: existVariant.name,
        imageUrl: existVariant.images[0].imageUrl,
        priceSnapshot: existVariant.price,
        quantity: data.quantity,
        stockSnapshot: existVariant.stock,
      };

      await this.cartItemRepo.addItem(payload);
    }

    const updatedCart = await this.getOrCreateCartEntity(userId);
    return CartMapper.toCartResponse(updatedCart);
  }

  async updateItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, cartItemId);
    }
    const cart = await this.getOrCreateCartEntity(userId);
    const item = cart.items.find((i) => i.id === cartItemId);
    if (!item) {
      throw new NotFoundException('Cart item not found.');
    }

    const stock = item.variant?.stock;
    const finalQty = Math.min(quantity, stock!);

    await this.cartItemRepo.updateCartItem(
      { id: cartItemId },
      {
        quantity: finalQty,
        priceSnapshot: item.variant?.price,
        stockSnapshot: stock,
      },
    );

    const updatedCart = await this.getOrCreateCartEntity(userId);

    return CartMapper.toCartResponse(updatedCart);
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const cart = await this.getOrCreateCartEntity(userId);

    const item = cart.items.some((i) => i.id === cartItemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepo.removeItem(cartItemId);

    const updatedCart = await this.getOrCreateCartEntity(userId);

    return CartMapper.toCartResponse(updatedCart);
  }

  async clearUserCart(userId: string) {
    const cart = await this.getOrCreateCartEntity(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return this.cartRepo.clearCart(cart.id);
  }

  async updateSelection(userId: string, cartItemIds: string[]) {
    await this.cartItemRepo.updateCartItems(
      { cart: { userId } },
      { isSelected: false },
    );

    await this.cartItemRepo.updateCartItems(
      {
        cart: { userId },
        id: { in: cartItemIds },
      },
      { isSelected: true },
    );
  }
}
