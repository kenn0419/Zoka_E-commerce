import { Outlet } from "react-router-dom";
import styles from "./UserLayout.module.scss";
import Footer from "../../components/layout/user/Footer";
import Header from "../../components/layout/user/Header";
import { Layout } from "antd";
import ChatFloatButton from "../../components/chat/ChatFloatButton";
import { useAuthStore } from "../../store/auth.store";

export default function UserLayout() {
  const user = useAuthStore((state) => state.user);

  return (
    <Layout className={styles.layout}>
      <Header />

      <Layout.Content className={styles.content}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </Layout.Content>

      <Footer />

      {user && <ChatFloatButton />}
    </Layout>
  );
}
