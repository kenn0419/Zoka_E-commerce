import DiscountGrid from "../../../components/discount/DiscountGrid";
import DiscountTabs from "../../../components/discount/DiscountTabs";
import styles from "./MyDisCount.module.scss";

export default function MyDiscountPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Voucher Center</h1>
        <p>Collect and apply discounts for your next purchase</p>
      </div>

      <DiscountTabs />

      <DiscountGrid />
    </div>
  );
}
