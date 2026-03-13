export type CalculatedShopOrder = {
  shopId: string;
  shopName: string;
  items: CartItemWithProduct[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
};
