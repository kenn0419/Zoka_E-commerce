import { Navigate } from "react-router-dom";
import { type JSX } from "react";
import { PATH } from "../../utils/path.util";
import { useAuthStore } from "../../store/auth.store";
import { Role } from "../../utils/constant.util";
import { includeRole } from "../../utils/helper.util";

interface AuthorizeEntryProps {
  children: JSX.Element;
}

export default function AuthorizeEntry({ children }: AuthorizeEntryProps) {
  const { user } = useAuthStore();

  if (user) {
    if (includeRole(user, Role.ADMIN))
      return <Navigate to={`/${PATH.ADMIN}`} replace />;
    if (includeRole(user, Role.SHOP))
      return <Navigate to={`/${PATH.SELLER}`} replace />;
    return <Navigate to={`/${PATH.HOME}`} replace />;
  }

  return children;
}
