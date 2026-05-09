import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Wrapper para rutas públicas que solo permite el acceso a usuarios no autenticados.
 *
 *  Verifica si existe una sesión activa. Si hay un usuario autenticado, redirige automáticamente a la página principal. Si no hay usuario, permite el acceso a la ruta pública.
 *
 * @example
 * <Route element={<PublicRoute />}>
 *   <Route path="/login" element={<LoginPage />} />
 * </Route>
 *
 * En este ejemplo, la ruta "/login" solo será accesible para usuarios que no estén autenticados. Si un usuario autenticado intenta acceder a esta ruta, será redirigido a la página principal.
 */
export const PublicRoute = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
