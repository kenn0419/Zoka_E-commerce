import { type RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";
import { lazy } from "react";
import MainLayout from "../layouts/MainLayout";

const HomePage = lazy(() => import("../pages/public/HomePage"));
const ProductDetailPage = lazy(() => import("../pages/product/ProductDetail"));
const ProductListPage = lazy(() => import("../pages/product/ProductList"));
const ShopPage = lazy(() => import("../pages/shop/ShopPage"));
const OrderSuccessPage = lazy(() => import("../pages/result/OrderSuccess"));

export const PublicRoutes: RouteObject = {
  path: PATH.HOME,
  element: <MainLayout />,
  children: [
    { index: true, element: <HomePage /> },

    { path: PATH.PRODUCTS, element: <ProductListPage /> },
    { path: PATH.PRODUCT_DETAIL, element: <ProductDetailPage /> },

    {
      path: `public/${PATH.SHOP}/:slug`,
      element: <ShopPage />,
    },
    {
      path: PATH.ORDER_SUCESS,
      element: <OrderSuccessPage />,
    },
  ],
};
