import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const ProtectedRoute = ({
  requiresAdmin = false,
}: {
  requiresAdmin?: boolean;
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiresAdmin && user.esAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
