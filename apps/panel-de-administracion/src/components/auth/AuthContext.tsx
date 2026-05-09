import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios, { type AxiosInstance } from "axios";

/**
 * Contiene la información del usuario autenticado.
 */
export interface User {
  id: number;
  nombre: string;
  esAdmin: boolean;
}

/**
 * Tipo de contexto de autenticación que define la estructura del objeto proporcionado por el AuthContext. Incluye el estado del usuario autenticado, las funciones para iniciar sesión y cerrar sesión, y la instancia de Axios para realizar solicitudes al backend.
 */
export interface AuthContextType {
  user: User | null;
  /**
   * Inicia sesión y guarda los datos del usuario en LocalStorage.
   */
  login: (
    correo: string,
    password: string,
  ) => Promise<{ success: boolean; msg?: string }>;
  /**
   * Cierra sesión en el API y limpia el estado local del navegador
   */
  logout: () => Promise<void>;
  /**
   * Instancia de axios configurada para realizar solicitudes al backend.
   * Incluye la URL base y el envío de cookies para mantener la sesión autenticada.
   */
  api: AxiosInstance;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proovedor del contexto de autenticación.
 *
 *  Instala un interceptor global de Axios que expulsa al usuario a la pantalla de login automáticamente si el backend responde con error 401.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("siscomat_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setUser(null);
          localStorage.removeItem("siscomat_user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  /**
   * Inicia sesión y guarda los datos del usuario en LocalStorage.
   * @param correo Correo electrónico del usuario que intenta iniciar sesión.
   * @param password Contraseña del usuario que intenta iniciar sesión.
   * @returns Promise que resuelve con el resultado de la operación.
   * - Si el inicio de sesión es exitoso, la promesa se resuelve con un objeto que tiene `success: true`.
   * - Si ocurre un error, la promesa se resuelve con un objeto que tiene `success: false` y un mensaje de error descriptivo en la propiedad `msg`.
   */
  const login = async (correo: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { correo, password });
      const userData = response.data.user;

      setUser(userData);
      localStorage.setItem("siscomat_user", JSON.stringify(userData));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        msg: error.response?.data?.message || "Error de conexión",
      };
    }
  };

  /**
   * Cierra sesión en el API y limpia el estado local del navegador. Envía una solicitud al backend para cerrar la sesión actual. Independientemente de si la solicitud es exitosa o no, limpia el estado del usuario en el frontend y elimina los datos del usuario almacenados en LocalStorage para garantizar que el usuario quede completamente desconectado.
   */
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión");
    } finally {
      setUser(null);
      localStorage.removeItem("siscomat_user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto de autenticación. Proporciona acceso al estado del usuario autenticado, las funciones de inicio de sesión y cierre de sesión, y la instancia de Axios para realizar solicitudes al backend.
 *
 * @throws Error si se intenta usar el hook fuera de un AuthProvider.
 *
 * @example
 * const { user, login, logout, api } = useAuth();
 *
 * const hacerPeticion = async () => {
 *  const response = await api.get("/ruta-protegida");
 * }
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth se debe usar dentro de un AuthProvider");
  }
  return context;
};
