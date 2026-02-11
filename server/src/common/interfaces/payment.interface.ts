export interface PaymentStrategy {
  createPayment(input: {
    paymentId: string;
    amount: number;
    orderInfo: string;
  }): Promise<{
    payUrl: string;
  }>;
}
