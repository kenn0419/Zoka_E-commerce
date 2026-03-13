import { Button, Checkbox, InputNumber, Popconfirm } from "antd";
import styles from "./CartItem.module.scss";
import { useCartStore } from "../../../store/cart.store";
import {
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "../../../queries/cart.query";

interface ICartItemProps {
  item: ICartItemResponse;
}

export default function CartItem({ item }: ICartItemProps) {
  const checkedMap = useCartStore((s) => s.checkedMap);
  const toggleItem = useCartStore((s) => s.toggleItem);
  const checked = !!checkedMap[item.id];
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();

  return (
    <div className={styles.cartItem}>
      <div className={styles.checkbox}>
        <Checkbox
          checked={checked}
          disabled={!item.isAvailable}
          onChange={() => toggleItem(item.id)}
        />
      </div>

      <img src={item.imageUrl} className={styles.image} />

      <div className={styles.info}>
        <div className={styles.name}>{item.productName}</div>
        <div className={styles.variant}>{item.variantName}</div>
      </div>

      <div className={styles.price}>₫{item.displayPrice.toLocaleString()}</div>

      <InputNumber
        min={1}
        max={item.availableStock}
        value={item.quantity}
        size="small"
        disabled={!item.isAvailable}
        onChange={(value) => {
          if (typeof value === "number") {
            updateMutation.mutate({
              cartItemId: item.id,
              quantity: value,
            });
          }
        }}
      />

      <div className={styles.subtotal}>
        ₫{(item.displayPrice * item.quantity).toLocaleString()}
      </div>

      <Popconfirm
        title="Xóa sản phẩm này?"
        onConfirm={() => removeMutation.mutate(item.id)}
      >
        <Button className={styles.remove}>Xóa</Button>
      </Popconfirm>
    </div>
  );
}
