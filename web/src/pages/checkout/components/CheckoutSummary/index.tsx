import styles from "./CheckoutSummary.module.scss";
import { Button, Spin } from "antd";

interface CheckoutSummaryProps {
  summary?: ICheckoutPreviewSummaryResponse;
  isLoading: boolean;
}

export default function CheckoutSummary({
  summary,
  isLoading,
}: CheckoutSummaryProps) {
  if (isLoading) {
    return <Spin fullscreen />;
  }
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

      <Button type="primary" block size="large">
        Đặt hàng
      </Button>
    </div>
  );
}
