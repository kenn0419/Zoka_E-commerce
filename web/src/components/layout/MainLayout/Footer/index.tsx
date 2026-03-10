import styles from "./Footer.module.scss";
import logo from "../../../../assets/images/logo-zoka-ecommerce.png";
import {
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
} from "@ant-design/icons";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.container}>
          <div className={styles.column}>
            <img src={logo} alt="logo" className={styles.logo} />
            <p className={styles.description}>
              Zoka là nền tảng thương mại điện tử hiện đại, giúp kết nối người
              bán và người mua một cách nhanh chóng và an toàn.
            </p>
          </div>

          <div className={styles.column}>
            <h4>Về Zoka</h4>
            <a href="#">Giới thiệu</a>
            <a href="#">Tuyển dụng</a>
            <a href="#">Điều khoản</a>
            <a href="#">Chính sách bảo mật</a>
          </div>

          <div className={styles.column}>
            <h4>Hỗ trợ khách hàng</h4>
            <a href="#">Trung tâm hỗ trợ</a>
            <a href="#">Hướng dẫn mua hàng</a>
            <a href="#">Chính sách đổi trả</a>
            <a href="#">Liên hệ</a>
          </div>

          <div className={styles.column}>
            <h4>Kết nối với chúng tôi</h4>
            <div className={styles.social}>
              <FacebookFilled />
              <InstagramFilled />
              <YoutubeFilled />
            </div>
            <p>Email: support@zoka.com</p>
            <p>Hotline: 1900 1234</p>
          </div>
        </div>
      </div>

      <div className={styles.payment}>
        <div className={styles.container}>
          <span>Phương thức thanh toán:</span>
          <div className={styles.paymentIcons}>
            <div>VISA</div>
            <div>MasterCard</div>
            <div>MoMo</div>
            <div>ZaloPay</div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} Zoka Ecommerce. All rights reserved.
      </div>
    </footer>
  );
}
