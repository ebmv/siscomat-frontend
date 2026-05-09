import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Wrapper para rutas protegidas que solo permite el acceso a usuarios autenticados.
 *
 *  Verifica si existe una sesión activa. Si no hay usuario, redirige automáticamente a la página de login.
 * Si se establece la propiedad "requiresAdmin" en true, también verifica que el usuario tenga privilegios de administrador. Si el usuario no es administrador, redirige a la página principal.
 *
 * @example
 * <Route element={<ProtectedRoute requiresAdmin={true} />}>
 *   <Route path="/admin" element={<AdminPage />} />
 * </Route>
 *
 * En este ejemplo, la ruta "/admin" solo será accesible para usuarios autenticados que tengan privilegios de administrador.
 * */
export const ProtectedRoute = ({
  requiresAdmin = false,
}: {
  /**
   * Si es true, bloquea el acceso a la ruta para usuarios que no tengan privilegios de administrador.
   * @default false
   */
  requiresAdmin?: boolean;
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiresAdmin && !user.esAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
