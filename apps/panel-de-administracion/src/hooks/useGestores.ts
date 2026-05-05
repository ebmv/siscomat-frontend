import { useState, useCallback } from "react";
import { useAuth } from "../components";

interface Gestor {
  id?: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  correo: string;
  passwordHash?: string;
  esAdmin: boolean;
}

const useGestores = () => {
  const [gestores, setGestores] = useState<Array<Gestor>>([]);
  const [selectedGestor, setSelectedGestor] = useState<Gestor | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingGestor, setLoadingGestor] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { api } = useAuth();

  const fetchGestores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Gestor[]>("/gestores");
      setGestores(response.data);
    } catch (error: any) {
      setError("Error al obtener gestores");
    } finally {
      setLoading(false);
    }
  }, [api]);

  const fetchGestor = useCallback(
    async (id: number) => {
      setLoadingGestor(true);
      setError(null);
      try {
        const response = await api.get<Gestor>(`/gestores/${id}`);
        setSelectedGestor(response.data);
      } catch (error: any) {
        setError("Error al obtener información del gestor.");
      } finally {
        setLoadingGestor(false);
      }
    },
    [api],
  );

  const addGestor = async (gestor: Gestor) => {
    try {
      await api.post("/gestores", gestor);
      fetchGestores();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Error al crear usuario.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteGestor = async (id: number) => {
    try {
      await api.delete(`/gestores/${id}`);
      fetchGestores();
    } catch (error: any) {
      setError("Error al eliminar gestor.");
      throw error;
    }
  };

  const updateGestor = async (gestor: Gestor, id: number) => {
    try {
      await api.put(`/gestores/${id}`, gestor);
      fetchGestores();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Error al actualizar usuario.";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    gestores,
    selectedGestor,
    error,
    loading,
    loadingGestor,
    fetchGestores,
    fetchGestor,
    addGestor,
    deleteGestor,
    updateGestor,
  };
};

export default useGestores;
