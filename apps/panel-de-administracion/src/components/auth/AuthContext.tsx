import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios, { type AxiosInstance } from "axios";

interface User {
  id: number;
  nombre: string;
  esAdmin: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    correo: string,
    password: string,
  ) => Promise<{ success: boolean; msg?: string }>;
  logout: () => Promise<void>;
  api: AxiosInstance;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth se debe usar dentro de un AuthProvider");
  }
  return context;
};
