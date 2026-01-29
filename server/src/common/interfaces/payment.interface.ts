export interface PaymentStrategy {
  createPayment(input: {
    orderId: string;
    amount: number;
    orderInfo: string;
  }): Promise<{
    payUrl: string;
  }>;
}
