import styles from "./CartSummary.module.scss";
import { useCartStore } from "../../../store/cart.store";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../utils/path.util";
import {
  useCartQuery,
  useUpdateSelectionMutation,
} from "../../../queries/cart.query";

export default function CartSummary() {
  const navigate = useNavigate();

  const { data } = useCartQuery();
  const checkedMap = useCartStore((s) => s.checkedMap);
  const getSelectedIds = useCartStore((s) => s.getSelectedIds);
  const updateSelectionMutation = useUpdateSelectionMutation();

  if (!data) return null;

  const selectedItems = data.items.filter(
    (i) => checkedMap[i.id] && i.isAvailable,
  );

  const selectedCount = selectedItems.length;

  const subtotal = selectedItems.reduce((sum, i) => sum + i.subtotal, 0);

  const handleCheckout = async () => {
    const selectedIds = getSelectedIds();
    if (!selectedIds) return;

    await updateSelectionMutation.mutateAsync(selectedIds);

    navigate(`/${PATH.USER}/${PATH.CHECKOUT}`);
  };

  return (
    <div className={styles.summary}>
      <div className={styles.row}>
        <h3>Tạm tính ({selectedCount} sản phẩm)</h3>
        <span>₫{subtotal.toLocaleString()}</span>
      </div>

      <div className={styles.total}>
        <span>Tổng cộng</span>
        <span>₫{subtotal.toLocaleString()}</span>
      </div>

      <Button
        className={styles.checkout}
        disabled={!selectedCount}
        loading={updateSelectionMutation.isPending}
        onClick={handleCheckout}
      >
        Mua hàng
      </Button>
    </div>
  );
}
