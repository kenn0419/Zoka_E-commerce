import type { RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";
import ProtectedRoute from "./guards/ProtectRoute";
import ShopLayout from "../layouts/ShopLayout";
import { lazy } from "react";

const DashboardPage = lazy(() => import("../pages/shop/Dashboard"));
const ProductManagementPage = lazy(
  () => import("../pages/shop/ProductManagement"),
);
const ProductCreationPage = lazy(() => import("../pages/shop/ProductCreation"));
const OrderManagementPage = lazy(() => import("../pages/shop/OrderManagement"));
const FinanceManagementPage = lazy(
  () => import("../pages/shop/FinanceManagement"),
);
const ProductReviewManagementPage = lazy(
  () => import("../pages/shop/ProductReview"),
);
const DiscountManagementPage = lazy(
  () => import("../pages/shop/DiscountManagement"),
);
const RevenueReportPage = lazy(() => import("../pages/shop/RevenueReport"));

export const ShopRoutes: RouteObject = {
  path: `/${PATH.SELLER}/:shopId`,
  children: [
    {
      element: (
        <ProtectedRoute roles={["shop"]}>
          <ShopLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <DashboardPage /> },
        { path: PATH.MANAGE_PRODUCT, element: <ProductManagementPage /> },
        { path: PATH.MANAGE_ORDER, element: <OrderManagementPage /> },
        { path: PATH.MANAGE_FINANCE, element: <FinanceManagementPage /> },
        { path: PATH.CREATE_PRODUCT, element: <ProductCreationPage /> },
        { path: PATH.MANAGE_REVIEW, element: <ProductReviewManagementPage /> },
        { path: PATH.MANAGE_DISCOUNT, element: <DiscountManagementPage /> },
        { path: PATH.REVENUE_REPORT, element: <RevenueReportPage /> },
      ],
    },
  ],
};
