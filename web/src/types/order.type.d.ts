type IOrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";

type OrderSort =
  | "newest"
  | "oldest"
  | "paid_at_asc"
  | "paid_at_desc"
  | "total_price_asc"
  | "total_price_desc";

interface IOrderQueries extends IPaginationQueries {
  sort?: OrderSort;
}

interface IOrderResponse {
  id: string;
  code: string;
  status: IOrderStatus;
  paymentMethod: IPaymentMethod;
  subtotal: number;
  shippingFee: number;
  discount: 0;
  totalPrice: number;
  note: string;
  shop: IShopResponse;
  buyer: IUserResponse;
  createAt: string;
}
