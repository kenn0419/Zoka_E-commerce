export type CalculatedShopOrder = {
  shopId: string;
  items: CartItemWithProduct[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
};
