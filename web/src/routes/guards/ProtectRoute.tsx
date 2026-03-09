import { Navigate } from "react-router-dom";
import { PATH } from "../../utils/path.util";
import { useMeQuery } from "../../queries/auth.query";
import LoadingFallback from "../../components/common/LoadingFallback";
import { includeRole } from "../../utils/helper.util";

interface ProtectedRouteProps {
  roles: Array<"user" | "shop" | "admin">;
  children: JSX.Element;
}

export default function ProtectedRoute({
  roles,
  children,
}: ProtectedRouteProps) {
  const { data: user, isLoading, isError } = useMeQuery();

  if (isLoading) return <LoadingFallback />;

  if (isError || !user) {
    return <Navigate to={`/${PATH.ERROR}/${PATH.UNAUTHORIZED}`} replace />;
  }

  const isAllowed = roles.some((role) => includeRole(user, role));

  if (!isAllowed) {
    return <Navigate to={`/${PATH.ERROR}/${PATH.FORBIDDEN}`} replace />;
  }

  return children;
}
