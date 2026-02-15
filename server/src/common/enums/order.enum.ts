export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export enum OrderSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  PAID_AT_ASC = 'paid_at_asc',
  PAID_AT_DESC = 'paid_at_desc',
  TOTAL_PRICE_ASC = 'total_price_asc',
  TOTAL_PRICE_DESC = 'total_price_desc',
}
