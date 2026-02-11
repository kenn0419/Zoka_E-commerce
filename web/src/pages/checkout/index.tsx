import { useNavigate } from "react-router-dom";
import styles from "./CheckoutPage.module.scss";
import AddressBlock from "./components/AddressBlock";
import CheckoutSummary from "./components/CheckoutSummary";
import DiscountBlock from "./components/DiscountBlock";
import PaymentMethodBlock from "./components/PaymentMethodBlock";
import ShopOrderBlock from "./components/ShopOrderBlock";
import { PATH } from "../../utils/path.util";
import { useState, useMemo, useEffect } from "react";
import { useCheckoutPreviewQuery } from "../../queries/checkout.query";
import { useCartQuery } from "../../queries/cart.query";
import { Spin } from "antd";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const { data: cart, isLoading: cartLoading } = useCartQuery();

  const [addressId, setAddressId] = useState<string | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "MOMO">("COD");
  const [couponCode, setCouponCode] = useState<string | undefined>();

  useEffect(() => {
    if (!cartLoading && cart?.items && cart.items.length === 0) {
      navigate(`/${PATH.CART}`);
    }
  }, [cart, cartLoading, navigate]);

  const previewParams = useMemo(
    () => ({
      addressId,
      paymentMethod,
      couponCode,
    }),
    [addressId, paymentMethod, couponCode],
  );
  const previewQuery = useCheckoutPreviewQuery(previewParams, !cartLoading);

  if (cartLoading) {
    return <Spin fullscreen />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.block}>
          <AddressBlock
            address={previewQuery.data?.address}
            onChangeAddress={setAddressId}
          />
        </div>

        <div className={styles.main}>
          <div className={styles.left}>
            <div className={styles.block}>
              <ShopOrderBlock shops={previewQuery.data?.shops} />
            </div>

            <div className={styles.block}>
              <DiscountBlock
                discounts={previewQuery.data?.coupons}
                selectedCouponCode={couponCode}
                onApplyCoupon={setCouponCode}
              />
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.block}>
              <PaymentMethodBlock
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
            </div>

            <div className={styles.block}>
              <CheckoutSummary
                summary={previewQuery.data?.summary}
                isLoading={previewQuery.isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
