import { useState } from "react";
import styles from "./DiscountBlock.module.scss";
import DiscountModal from "../../../../components/discounts/DiscountModal";

interface DiscountBlockProps {
  selectedCouponCode?: string;
  onApplyCoupon: (code?: string) => void;
  discounts?: ICheckoutPreviewCouponResponse[];
}

export default function DiscountBlock({
  discounts = [],
  selectedCouponCode,
  onApplyCoupon,
}: DiscountBlockProps) {
  const [openDiscountModal, setOpenDiscountModal] = useState(false);

  const selectedCoupon = discounts.find(
    (discount) => discount.code === selectedCouponCode,
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.icon} />
        <div className={styles.label}>Voucher</div>

        {selectedCoupon && (
          <div className={styles.selected}>{selectedCoupon.code}</div>
        )}
      </div>

      <button
        className={styles.actionBtn}
        onClick={() => setOpenDiscountModal(true)}
      >
        {selectedCoupon ? "Thay đổi" : "Chọn hoặc nhập mã"}
      </button>

      {openDiscountModal && (
        <DiscountModal
          discounts={discounts}
          selectedCouponCode={selectedCouponCode}
          onClose={() => setOpenDiscountModal(false)}
          onApply={(code) => {
            onApplyCoupon(code);
            setOpenDiscountModal(false);
          }}
        />
      )}
    </div>
  );
}
