import { createBrowserRouter } from "react-router-dom";
import { AdminRoutes } from "./admin.routes";
import { AuthRoutes } from "./auth.routes";
import NotFound from "../pages/error/NotFound";
import { ErrorRoutes } from "./error.routes";
import { ShopRoutes } from "./shop.routes";
import { SellerRoutes } from "./seller.routes";
import { PublicRoutes } from "./public.routes";

export const router = createBrowserRouter([
  PublicRoutes,
  ShopRoutes,
  SellerRoutes,
  AdminRoutes,
  AuthRoutes,
  ErrorRoutes,
  { path: "*", element: <NotFound /> },
]);
