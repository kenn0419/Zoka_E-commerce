import { Card, Button, Tag } from "antd";
import styles from "./OrderCard.module.scss";

export default function OrderCard({ order }: any) {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.shop}>
          <span className={styles.shopName}>{order.shop}</span>
          <Button size="small" type="primary">
            Visit Shop
          </Button>
        </div>

        <div className={styles.status}>
          <Tag color="green">{order.deliveryStatus}</Tag>
          <span className={styles.orderStatus}>{order.status}</span>
        </div>
      </div>

      <div className={styles.items}>
        {order.items.map((item: any) => (
          <div key={item.id} className={styles.item}>
            <img src={item.image} />

            <div className={styles.info}>
              <h4>{item.name}</h4>
              <p className={styles.variant}>Variation: {item.variation}</p>
              <p>x{item.quantity}</p>
            </div>

            <div className={styles.price}>
              {item.oldPrice && (
                <span className={styles.old}>${item.oldPrice}</span>
              )}
              <span className={styles.new}>${item.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.total}>
          Order Total: <b>${order.total}</b>
        </div>

        <div className={styles.actions}>
          <Button type="primary">Buy Again</Button>
          <Button>Contact Seller</Button>
          <Button>View Details</Button>
        </div>
      </div>
    </Card>
  );
}
