import { CheckCircleFilled } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./OrderSuccessPage.module.scss";
import { PATH } from "../../../utils/path.util";

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <CheckCircleFilled className={styles.icon} />

        <h1>Đặt hàng thành công 🎉</h1>

        <p className={styles.desc}>
          Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.
        </p>

        <div className={styles.actions}>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate(`/${PATH.MANAGE_ORDER}`)}
          >
            Xem đơn hàng
          </Button>

          <Button size="large" onClick={() => navigate(`/${PATH.HOME}`)}>
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </div>
  );
}
