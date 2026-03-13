import { Input } from "antd";
import OrderItemRow from "../OrderItemRow";
import styles from "./ShopOrderBlock.module.scss";

interface ShopOrderBlockProps {
  shops?: ICheckoutPreviewShopResponse[];
  shopNotes: Record<string, string>;
  onChangeNote: (shopId: string, note: string) => void;
}

export default function ShopOrderBlock({
  shops,
  shopNotes,
  onChangeNote,
}: ShopOrderBlockProps) {
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
            <div className={styles.noteRow}>
              <span>Lời nhắn cho shop:</span>
              <Input
                placeholder="Nhập lời nhắn..."
                value={shopNotes[shop.shopId] || ""}
                onChange={(e) => onChangeNote(shop.shopId, e.target.value)}
              />
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.subtotal}>
              Tổng shop: ₫{shop.subtotal.toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
