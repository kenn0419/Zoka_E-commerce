import type { RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";
import ProtectedRoute from "./guards/ProtectRoute";
import ShopManagement from "../pages/admin/ShopManagement";
import DiscountManagement from "../pages/admin/DiscountManagement";
import OrderManagement from "../pages/admin/OrderManagement";

export const AdminRoutes: RouteObject = {
  path: PATH.ADMIN,
  children: [
    {
      element: (
        <ProtectedRoute roles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: PATH.MANAGE_USER, element: <UserManagement /> },
        { path: PATH.MANAGE_SHOP, element: <ShopManagement /> },
        { path: PATH.MANAGE_DISCOUNT, element: <DiscountManagement /> },
        { path: PATH.MANAGE_ORDER, element: <OrderManagement /> },
      ],
    },
  ],
};
