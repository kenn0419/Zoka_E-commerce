import { useNavigate } from "react-router-dom";
import styles from "./CheckoutPage.module.scss";
import AddressBlock from "./components/AddressBlock";
import CheckoutSummary from "./components/CheckoutSummary";
import DiscountBlock from "./components/DiscountBlock";
import PaymentMethodBlock from "./components/PaymentMethodBlock";
import ShopOrderBlock from "./components/ShopOrderBlock";
import { PATH } from "../../utils/path.util";
import { useState, useMemo, useEffect } from "react";
import {
  useCheckoutConfirmMutation,
  useCheckoutPreviewQuery,
} from "../../queries/checkout.query";
import { useCartQuery } from "../../queries/cart.query";
import { message, Spin } from "antd";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [addressId, setAddressId] = useState<string | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "MOMO">("COD");
  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [shopNotes, setShopNotes] = useState<Record<string, string>>({});

  const previewParams = useMemo(
    () => ({
      addressId,
      paymentMethod,
      couponCode,
    }),
    [addressId, paymentMethod, couponCode],
  );
  const { data: cart, isLoading: cartLoading } = useCartQuery();
  const previewQuery = useCheckoutPreviewQuery(previewParams, !cartLoading);
  const confirmMutation = useCheckoutConfirmMutation();

  useEffect(() => {
    if (!cartLoading && cart?.items && cart.items.length === 0) {
      navigate(`/${PATH.USER}/${PATH.CART}`);
    }
  }, [cart, cartLoading, navigate]);

  const handleChangeNote = (shopId: string, value: string) => {
    setShopNotes((prev) => ({
      ...prev,
      [shopId]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    try {
      const notesArray = Object.entries(shopNotes).map(([shopId, note]) => ({
        shopId,
        note,
      }));
      const res = await confirmMutation.mutateAsync({
        paymentMethod,
        couponCode,
        notes: notesArray,
      });

      if (paymentMethod === "COD") {
        message.success("Đặt hàng thành công.");
        navigate(`/${PATH.ORDER_SUCESS}`);
        return;
      }

      if (res.payUrl) {
        window.location.href = res.payUrl;
      }
    } catch (error) {
      message.error("Đặt hàng thất bại");
    }
  };

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
              <ShopOrderBlock
                shops={previewQuery.data?.shops}
                shopNotes={shopNotes}
                onChangeNote={handleChangeNote}
              />
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
                isLoading={confirmMutation.isPending}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
