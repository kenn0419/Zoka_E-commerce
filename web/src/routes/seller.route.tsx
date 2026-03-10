import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import SellerEntry from "./guards/SellerEntry";
import { PATH } from "../utils/path.util";

const RegisterShopPage = lazy(() => import("../pages/seller/ShopRegister"));
const SelectShopPage = lazy(() => import("../pages/seller/ShopSelection"));

export const SellerRoutes: RouteObject = {
  path: PATH.SELLER,
  children: [
    {
      index: true,
      element: <SellerEntry />,
    },
    {
      path: PATH.REGISTER_SHOP,
      element: <RegisterShopPage />,
    },
    {
      path: PATH.SELECT_SHOP,
      element: <SelectShopPage />,
    },
  ],
};
