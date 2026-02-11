import { Row, Col, Checkbox, Spin } from "antd";
import { useCartStore } from "../../../store/cart.store";
import CartItem from "../../../components/cart/CartItem";
import CartSummary from "../../../components/cart/CartSummary";
import EmptyCart from "../../../components/cart/EmptyCard.tsx";
import { useCartQuery } from "../../../queries/cart.query.ts";
import { useEffect } from "react";
import { useAuthStore } from "../../../store/auth.store.ts";

export default function CartPage() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading } = useCartQuery(!!user);
  const { init, toggleAll, checkedMap } = useCartStore();

  useEffect(() => {
    if (data?.items) {
      init(data.items);
    }
  }, [data, init]);
  if (isLoading) return <Spin />;
  if (!data?.items.length) return <EmptyCart />;

  const availableIds = data.items.filter((i) => i.isAvailable).map((i) => i.id);

  const allChecked =
    availableIds.length > 0 && availableIds.every((id) => checkedMap[id]);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <Checkbox
          checked={allChecked}
          onChange={(e) => toggleAll(availableIds, e.target.checked)}
        >
          Chọn tất cả ({availableIds.length})
        </Checkbox>
      </div>

      <Row gutter={16}>
        <Col span={16}>
          {data.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </Col>

        <Col span={8}>
          <CartSummary />
        </Col>
      </Row>
    </div>
  );
}
