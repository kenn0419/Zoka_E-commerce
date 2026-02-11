import styles from "./OrderItemRow.module.scss";

interface OrderShopRowProps {
  item: ICheckoutPreviewItemResponse;
  subtotal: number;
}

export default function OrderItemRow({ item, subtotal }: OrderShopRowProps) {
  return (
    <div className={styles.row}>
      <img src={item.imageUrl} />

      <div className={styles.info}>
        <div className={styles.name}>{item.productName}</div>
        <div className={styles.variant}>{item.variantName}</div>
      </div>

      <div>x{item.quantity}</div>
      <div className={styles.price}>₫{subtotal}</div>
    </div>
  );
}
