import styles from "./CheckoutSummary.module.scss";
import { Button } from "antd";

interface CheckoutSummaryProps {
  summary?: ICheckoutPreviewSummaryResponse;
  isLoading: boolean;
  onPlaceOrder: () => void;
}

export default function CheckoutSummary({
  summary,
  isLoading,
  onPlaceOrder,
}: CheckoutSummaryProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <span>Tổng tiền hàng</span>
        <span>₫{summary?.subtotal}</span>
      </div>

      <div className={styles.row}>
        <span>Phí vận chuyển</span>
        <span>₫{summary?.shippingFee}</span>
      </div>

      <div className={styles.total}>
        <span>Tổng thanh toán</span>
        <strong>₫{summary?.total}</strong>
      </div>

      <Button
        type="primary"
        block
        size="large"
        loading={isLoading}
        onClick={onPlaceOrder}
      >
        Đặt hàng
      </Button>
    </div>
  );
}
