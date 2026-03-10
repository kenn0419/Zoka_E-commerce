import type { RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";
import ProtectedRoute from "./guards/ProtectRoute";
import MainLayout from "../layouts/MainLayout";
import { lazy } from "react";
import UserLayout from "../layouts/UserLayout";

const CartPage = lazy(() => import("../pages/user/Cart"));
const CheckoutPage = lazy(() => import("../pages/checkout"));
const MyOrderPage = lazy(() => import("../pages/user/MyOrder"));
const MyProfilePage = lazy(() => import("../pages/user/MyProfile"));
const MyDiscountPage = lazy(() => import("../pages/user/MyDiscount"));
const MyAddressPage = lazy(() => import("../pages/user/MyAddress"));
const ChangePasswordPage = lazy(() => import("../pages/user/ChangePassword"));

export const UserRoutes: RouteObject = {
  path: PATH.USER,
  element: (
    <ProtectedRoute roles={["user"]}>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      element: <UserLayout />,
      children: [
        { path: PATH.MANAGE_ORDER, element: <MyOrderPage /> },
        { path: PATH.PROFILE, element: <MyProfilePage /> },
        { path: PATH.CHANGE_PASSWORD, element: <ChangePasswordPage /> },
        { path: PATH.MANAGE_DISCOUNT, element: <MyDiscountPage /> },
        { path: PATH.MANAGE_ADDRESS, element: <MyAddressPage /> },
      ],
    },
    {
      children: [
        {
          path: PATH.CHECKOUT,
          element: <CheckoutPage />,
        },
        { path: PATH.CART, element: <CartPage /> },
      ],
    },
  ],
};
