type IPaymentMethod = COD | MOMO;

interface ICheckoutPreviewRequest {
  paymentMethod: IPaymentMethod;
  couponCode?: string;
  addressId?: string;
}

interface ICheckoutConfirmNoteRequest {
  shopId: string;
  note: string;
}

interface ICheckoutConfirmRequest {
  paymentMethod: string;
  notes?: ICheckoutConfirmNoteRequest[];
  couponCode?: string;
}

interface ICheckoutPreviewItemResponse {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  imageUrl: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface ICheckoutPreviewShopResponse {
  shopId: string;
  shopName: string;
  items: ICheckoutPreviewItemResponse[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

interface ICheckoutPreviewSummaryResponse {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

interface ICheckoutPreviewCouponResponse {
  id: string;
  code: string;
  description?: string;
  scope: CouponScope;
  type: CouponType;
  discount: number;
  maxDiscount?: number;
  discountValue: number;
  isEligible: boolean;
  disabledReason?: string;
}

interface ICheckoutPreviewResponse {
  shops: ICheckoutPreviewShopResponse[];
  summary: ICheckoutPreviewSummaryResponse;
  address: IAddressResponse;
  coupons?: ICheckoutPreviewCouponResponse[];
}

interface ICheckoutConfirmResponse {
  paymentId?: string;
  orderIds: string[];
  payUrl?: string;
}
