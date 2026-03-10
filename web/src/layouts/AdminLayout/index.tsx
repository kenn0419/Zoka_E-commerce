import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/AdminLayout/Sidebar";
import styles from "./AdminLayout.module.scss";
import Header from "../../components/layout/AdminLayout/Header";

const { Content } = Layout;

const AdminLayout = () => {
  return (
    <Layout className={styles.wrapper}>
      <Sidebar />

      <Layout>
        <Header />

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
