interface ICartSummaryResponse {
  totalItems: number;
  subtotal: number;
}

interface ICartItemResponse {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  imageUrl: string;
  displayPrice: number;
  quantity: number;
  availableStock: number;
  subtotal: number;
  isAvailable: boolean;
  isSelected: boolean;
}

interface ICartResponse {
  id: string;
  userId: string;
  items: ICartItemResponse[];
}

interface IAddCartRequest {
  variantId: string;
  quantity: number;
}

interface IUpdateCartRequest {
  cartItemId: string;
  quantity: number;
}
