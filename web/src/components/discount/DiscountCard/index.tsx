import { Button, Tag } from "antd";
import styles from "./DiscountCard.module.scss";

interface Props {
  discount: any;
}

export default function DiscountCard({ discount }: Props) {
  const renderValue = () => {
    if (discount.type === "percent") return `${discount.value}% OFF`;
    if (discount.type === "cashback") return `$${discount.value} Cashback`;
    return "Free Shipping";
  };

  return (
    <div className={styles.discountCard}>
      <div className={styles.left}>
        <span>{renderValue()}</span>
      </div>

      <div className={styles.right}>
        <div className={styles.header}>
          <h3>{discount.title}</h3>
          {discount.status && <Tag color="green">{discount.status}</Tag>}
        </div>

        <p>{discount.description}</p>

        <div className={styles.footer}>
          <span>Expire: {discount.expireAt}</span>

          <div className={styles.actions}>
            <Button type="primary">Use Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
