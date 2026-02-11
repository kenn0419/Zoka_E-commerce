import { Outlet } from "react-router-dom";
import styles from "./UserLayout.module.scss";
import Footer from "../../components/layout/user/Footer";
import { Content } from "antd/es/layout/layout";
import Header from "../../components/layout/user/Header";
import { Layout } from "antd";
import ChatFloatButton from "../../components/chat/ChatFloatButton";
import { useAuthStore } from "../../store/auth.store";

export default function UserLayout() {
  const user = useAuthStore((state) => state.user);
  return (
    <>
      <Layout className={styles.layout}>
        <Header />
        <Content className={styles.content}>
          <Outlet />
        </Content>
        <Footer />
      </Layout>
      {user && <ChatFloatButton />}
    </>
  );
}
