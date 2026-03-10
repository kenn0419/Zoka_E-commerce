import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { PATH } from "../utils/path.util";
import AuthLayout from "../layouts/AuthLayout";
import AuthorizeEntry from "./guards/AuthorizeEntry";

const SigninPage = lazy(() => import("../pages/auth/Signin"));
const SignupPage = lazy(() => import("../pages/auth/Signup"));
const VerifyAccountPage = lazy(() => import("../pages/auth/VerifyAccount"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPassword"));

export const AuthRoutes: RouteObject = {
  path: PATH.AUTH,
  element: (
    <AuthorizeEntry>
      <AuthLayout />
    </AuthorizeEntry>
  ),
  children: [
    { path: PATH.SIGNIN, element: <SigninPage /> },
    { path: PATH.SIGNUP, element: <SignupPage /> },
    { path: PATH.VERIFY_ACCOUNT, element: <VerifyAccountPage /> },
    { path: PATH.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
    { path: PATH.RESET_PASSWORD, element: <ResetPasswordPage /> },
  ],
};
