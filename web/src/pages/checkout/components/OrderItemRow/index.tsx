import styles from "./OrderItemRow.module.scss";

interface OrderShopRowProps {
  item: ICheckoutPreviewItemResponse;
  subtotal: number;
}

export default function OrderItemRow({ item, subtotal }: OrderShopRowProps) {
  return (
    <div className={styles.row}>
      <img className={styles.productThubnail} src={item.imageUrl} />

      <div className={styles.info}>
        <div className={styles.name}>{item.productName}</div>
        <div className={styles.variant}>Loại: {item.variantName}</div>
      </div>
      <div className={styles.price}>₫{item.priceSnapshot}</div>
      <div>x{item.quantity}</div>
      <div className={styles.subtotal}>₫{subtotal}</div>
    </div>
  );
}
