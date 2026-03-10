import { Menu } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  HomeOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import AvatarProfile from "../AvatarProfile";
import { PATH } from "../../../../utils/path.util";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      key: `/${PATH.USER}/${PATH.PROFILE}`,
      icon: <UserOutlined />,
      label: `Profile`,
    },
    {
      key: `/${PATH.USER}/${PATH.MANAGE_ORDER}`,
      icon: <ShoppingCartOutlined />,
      label: `My Orders`,
    },
    {
      key: `/${PATH.USER}/${PATH.MANAGE_DISCOUNT}`,
      icon: <GiftOutlined />,
      label: `My Vouchers`,
    },
    {
      key: `/${PATH.USER}/${PATH.MANAGE_ADDRESS}`,
      icon: <HomeOutlined />,
      label: `Addresses`,
    },
    {
      key: `/${PATH.USER}/${PATH.CHANGE_PASSWORD}`,
      icon: <LockOutlined />,
      label: `Change Password`,
    },
  ];

  return (
    <div className={styles.sidebar}>
      <AvatarProfile />
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
        className={styles.menu}
      />
    </div>
  );
}
