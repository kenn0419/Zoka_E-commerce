import { Layout, Badge, Dropdown, message } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  BellOutlined,
} from "@ant-design/icons";
import styles from "./Header.module.scss";
import { useAuthStore } from "../../../../store/auth.store";
import { Link, useNavigate } from "react-router-dom";
import { PATH } from "../../../../utils/path.util";
import SearchBar from "../../../common/SearchBar";
import { useLogoutMutation } from "../../../../queries/auth.query";
import { useCartSummaryQuery } from "../../../../queries/cart.query";
import { useMemo, useCallback } from "react";
import logo from "../../../../assets/images/logo.png";

export default function Header() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const { data: summary } = useCartSummaryQuery(!!user);

  const isAdmin = user?.roles?.some((role) => role.name === "admin");

  const handleLogout = useCallback(() => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        message.success("Đã đăng xuất");
        navigate(`/${PATH.HOME}`);
      },
    });
  }, [logoutMutation, navigate]);

  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      const routeMap: Record<string, string | (() => void)> = {
        profile: `/${PATH.USER}/${PATH.PROFILE}`,
        admin: `/${PATH.ADMIN}`,
        logout: handleLogout,
      };

      const action = routeMap[key];
      if (typeof action === "function") action();
      else if (action) navigate(action);
    },
    [navigate, handleLogout],
  );

  const menuItems = useMemo(
    () => [
      { key: "profile", label: "Tài khoản" },
      ...(isAdmin ? [{ key: "admin", label: "Quản lý hệ thống" }] : []),
      { key: "logout", label: "Đăng xuất" },
    ],
    [isAdmin],
  );

  const handleClickLogo = () => {
    navigate(`/${PATH.HOME}`);
  };

  return (
    <Layout.Header className={styles.header}>
      <div className={styles.container}>
        <div onClick={handleClickLogo} className={styles.logo}>
          {/* <div className={styles.icon}>🚀</div>
          <h1>Zoka</h1> */}
          <img src={logo} />
        </div>

        <div className={styles.searchWrapper}>
          <SearchBar />
        </div>

        <div className={styles.actions}>
          {user ? (
            <>
              <Badge count={summary?.totalItems ?? 0} size="small">
                <Link to={`/${PATH.USER}/${PATH.CART}`}>
                  <ShoppingCartOutlined className={styles.icon} />
                </Link>
              </Badge>

              <Link to={`/${PATH.SELLER}`}>
                <ShopOutlined className={styles.icon} />
              </Link>

              <Badge count={1} size="small">
                <BellOutlined className={styles.icon} />
              </Badge>

              <Dropdown
                menu={{ items: menuItems, onClick: handleMenuClick }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <UserOutlined className={styles.icon} />
              </Dropdown>
            </>
          ) : (
            <div className={styles.authActions}>
              <Link
                className={styles.signInBtn}
                to={`/${PATH.AUTH}/${PATH.SIGNIN}`}
              >
                <span>Đăng nhập</span>
              </Link>
              <Link to={`/${PATH.AUTH}/${PATH.SIGNUP}`}>Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </Layout.Header>
  );
}
