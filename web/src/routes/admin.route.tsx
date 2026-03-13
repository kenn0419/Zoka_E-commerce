import type { RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";
import AdminLayout from "../layouts/AdminLayout";
import { lazy } from "react";
import ProtectedRoute from "./guards/ProtectRoute";

const DashboardPage = lazy(() => import("../pages/admin/Dashboard"));
const UserManagementPage = lazy(() => import("../pages/admin/UserManagement"));
const ProductManagementPage = lazy(
  () => import("../pages/admin/ProductManagement"),
);
const ShopManagementPage = lazy(() => import("../pages/admin/ShopManagement"));
const CategoryManagementPage = lazy(
  () => import("../pages/admin/CategoryManagement"),
);
const DiscountManagementPage = lazy(
  () => import("../pages/admin/DiscountManagement"),
);
const OrderManagementPage = lazy(
  () => import("../pages/admin/OrderManagement"),
);
const ProductReviewManagementPage = lazy(
  () => import("../pages/admin/ProductReviewManagement"),
);
const RevenueReportPage = lazy(() => import("../pages/admin/RevenueReport"));

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
        { index: true, element: <DashboardPage /> },
        { path: PATH.MANAGE_USER, element: <UserManagementPage /> },
        { path: PATH.MANAGE_PRODUCT, element: <ProductManagementPage /> },
        { path: PATH.MANAGE_SHOP, element: <ShopManagementPage /> },
        { path: PATH.MANAGE_CATEGORY, element: <CategoryManagementPage /> },
        { path: PATH.MANAGE_DISCOUNT, element: <DiscountManagementPage /> },
        { path: PATH.MANAGE_ORDER, element: <OrderManagementPage /> },
        { path: PATH.MANAGE_REVIEW, element: <ProductReviewManagementPage /> },
        { path: PATH.REVENUE_REPORT, element: <RevenueReportPage /> },
      ],
    },
  ],
};
