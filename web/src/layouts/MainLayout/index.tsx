import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.scss";
import Footer from "../../components/layout/MainLayout/Footer";
import Header from "../../components/layout/MainLayout/Header";
import { Layout } from "antd";
import ChatFloatButton from "../../components/chat/ChatFloatButton";
import { useAuthStore } from "../../store/auth.store";

export default function MainLayout() {
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
