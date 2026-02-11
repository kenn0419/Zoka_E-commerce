import { Outlet, type RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";
import UserLayout from "../layouts/UserLayout";
import { lazy } from "react";
import ProtectedRoute from "./guards/ProtectRoute";

const HomePage = lazy(() => import("../pages/user/HomePage"));
const CartPage = lazy(() => import("../pages/user/Cart"));
const ProductDetailPage = lazy(() => import("../pages/product/ProductDetail"));
const ProductListPage = lazy(() => import("../pages/product/ProductList"));
const ShopPage = lazy(() => import("../pages/shop/ShopPage"));
const CheckoutPage = lazy(() => import("../pages/checkout"));

export const PublicRoutes: RouteObject = {
  path: PATH.USER,
  element: <UserLayout />,
  children: [
    { index: true, element: <HomePage /> },

    { path: PATH.PRODUCTS, element: <ProductListPage /> },
    { path: PATH.PRODUCT_DETAIL, element: <ProductDetailPage /> },

    {
      path: `public/${PATH.SHOP}/:slug`,
      element: <ShopPage />,
    },

    {
      element: (
        <ProtectedRoute roles={["user"]}>
          <Outlet />
        </ProtectedRoute>
      ),
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
