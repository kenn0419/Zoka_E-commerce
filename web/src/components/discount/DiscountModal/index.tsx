import { CloseOutlined } from "@ant-design/icons";
import styles from "./DiscountModal.module.scss";
import { Button, Empty } from "antd";
import clsx from "clsx";

interface Props {
  discounts: ICheckoutPreviewCouponResponse[];
  selectedCouponCode?: string;
  onApply: (code?: string) => void;
  onClose: () => void;
}

export default function DiscountModal({
  discounts,
  selectedCouponCode,
  onApply,
  onClose,
}: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Chọn Voucher</h3>
          <Button onClick={onClose}>
            <CloseOutlined />
          </Button>
        </div>

        <div className={styles.list}>
          {discounts.length > 0 ? (
            discounts.map((coupon) => {
              const isSelected = selectedCouponCode === coupon.code;

              return (
                <div
                  key={coupon.id}
                  className={clsx(styles.item, {
                    [styles.disabled]: !coupon.isEligible,
                    [styles.selected]: isSelected,
                  })}
                  onClick={() => {
                    if (!coupon.isEligible) return;
                    onApply(coupon.code);
                  }}
                >
                  <div className={styles.left}>
                    <strong>{coupon.code}</strong>
                    <p>{coupon.description}</p>

                    {!coupon.isEligible && (
                      <small>{renderReason(coupon.disabledReason)}</small>
                    )}
                  </div>

                  <div className={styles.right}>
                    -₫{coupon.discountValue.toLocaleString()}
                  </div>
                </div>
              );
            })
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </div>
  );
}

function renderReason(reason?: string) {
  switch (reason) {
    case "MIN_ORDER":
      return "Chưa đủ giá trị tối thiểu";
    case "SCOPE_MISMATCH":
      return "Không áp dụng cho shop này";
    case "EXPIRED":
      return "Đã hết hạn";
    case "USAGE_LIMIT":
      return "Đã hết lượt sử dụng";
    default:
      return "";
  }
}
