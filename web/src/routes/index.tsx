import { createBrowserRouter } from "react-router-dom";
import { AdminRoutes } from "./admin.route";
import { AuthRoutes } from "./auth.route";
import NotFound from "../pages/error/NotFound";
import { ErrorRoutes } from "./error.route";
import { ShopRoutes } from "./shop.route";
import { SellerRoutes } from "./seller.route";
import { PublicRoutes } from "./public.route";
import { UserRoutes } from "./user.route";

export const router = createBrowserRouter([
  PublicRoutes,
  UserRoutes,
  ShopRoutes,
  SellerRoutes,
  AdminRoutes,
  AuthRoutes,
  ErrorRoutes,
  { path: "*", element: <NotFound /> },
]);
