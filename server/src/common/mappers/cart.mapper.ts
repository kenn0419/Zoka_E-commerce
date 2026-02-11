import { ProductStatus } from '../enums/product.enum';

export class CartMapper {
  static toCartResponse(cart: any) {
    const items = this.toCartItemResponses(cart);

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      updatedAt: cart.updatedAt,
    };
  }

  static toCartSummaryResponse(items: any) {
    const availableItems = items.filter((i) => i.isAvailable);
    return {
      totalItems: availableItems.length,
      totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.subtotal, 0),
    };
  }

  static toCartItemResponses(cart: any) {
    return cart.items.map((item) => {
      const price = Number(item.variant.price);
      const stock = item.variant.stock;

      const isAvailable =
        item.product.status === ProductStatus.ACTIVE && stock > 0;
      const subtotal = Number(item.priceSnapshot) * item.quantity;
      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        variantName: item.variantName,
        imageUrl: item.imageUrl,
        priceSnapshot: price,
        quantity: item.quantity,
        stockSnapshot: item.stockSnapshot,
        isSelected: item.isSelected,
        subtotal,
        isAvailable,
      };
    });
  }
}
