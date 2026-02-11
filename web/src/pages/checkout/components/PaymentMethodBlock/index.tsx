import styles from "./PaymentMethodBlock.module.scss";

interface PaymentMethodBlockProps {
  value: IPaymentMethod;
  onChange: (method: IPaymentMethod) => void;
}

export default function PaymentMethodBlock({
  value,
  onChange,
}: PaymentMethodBlockProps) {
  const methods: {
    value: IPaymentMethod;
    label: string;
    description: string;
  }[] = [
    {
      value: "COD",
      label: "Thanh toán khi nhận hàng",
      description: "Thanh toán bằng tiền mặt khi nhận hàng",
    },
    {
      value: "MOMO",
      label: "Ví MoMo",
      description: "Thanh toán qua ví điện tử MoMo",
    },
  ];
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Phương thức thanh toán</div>

      <div className={styles.list}>
        {methods.map((method) => {
          const isSelected = value === method.value;

          return (
            <div
              key={method.value}
              className={`${styles.card} ${isSelected ? styles.selected : ""}`}
              onClick={() => onChange(method.value)}
            >
              <div className={styles.left}>
                <div className={styles.radio}>
                  {isSelected && <div className={styles.dot} />}
                </div>
              </div>

              <div className={styles.content}>
                <div className={styles.label}>{method.label}</div>
                <div className={styles.desc}>{method.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
