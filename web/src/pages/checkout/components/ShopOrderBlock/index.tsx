import OrderItemRow from "../OrderItemRow";
import styles from "./ShopOrderBlock.module.scss";

interface ShopOrderBlockProps {
  shops?: ICheckoutPreviewShopResponse[];
}

export default function ShopOrderBlock({ shops }: ShopOrderBlockProps) {
  return (
    <>
      {shops?.map((shop) => (
        <div key={shop.shopId} className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.shopIcon} />
            <div className={styles.shopName}>{shop.shopName}</div>
          </div>

          <div className={styles.items}>
            {shop.items.map((i) => (
              <OrderItemRow
                key={i.variantId}
                item={i}
                subtotal={shop.subtotal}
              />
            ))}
          </div>

          <div className={styles.footer}>
            <div>
              <div className={styles.shippingLabel}>Phí vận chuyển</div>
              <div className={styles.shippingFee}>
                ₫{shop.shippingFee.toLocaleString()}
              </div>
            </div>

            <div className={styles.subtotal}>
              Tổng shop: ₫{shop.subtotal.toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
