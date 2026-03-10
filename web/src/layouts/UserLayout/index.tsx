import { Outlet } from "react-router-dom";
import styles from "./UserLayout.module.scss";
import Sidebar from "../../components/layout/UserLayout/Sidebar";

export default function UserLayout() {
  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
