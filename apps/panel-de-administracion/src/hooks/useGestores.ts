import { useState, useCallback } from "react";
import { useAuth } from "../components";

/**
 * Interfaz que representa un gestor de la aplicación.
 */
export interface Gestor {
  /**
   * Asignado automáticamente por el backend.
   */
  id?: number;

  nombre: string;
  apellido1: string;
  apellido2: string;

  /**
   * Este campo es obligatorio al crear o actualizar un gestor y debe ser único en la base de datos para evitar conflictos con otros gestores. El correo electrónico se utiliza para la autenticación.
   */
  correo: string;
  /**
   * Este campo es obligatorio al crear un nuevo gestor, pero no es necesario incluirlo al actualizar un gestor existente a menos que se desee cambiar la contraseña. La contraseña se almacena en la base de datos como un hash para garantizar la seguridad de las credenciales del gestor.
   */
  passwordHash?: string;
  /**
   * Representa si el gestor tiene privilegios de administrador en la aplicación.
   * - Si es true, el gestor tiene acceso a todas las funcionalidades de la aplicación, incluyendo la gestión de usuarios.
   * - Si es false, el gestor tiene acceso limitado a funcionalidades de gestión de constancias.
   */
  esAdmin: boolean;
}

/**
 * Hook para gestionar los gestores de la aplicación.
 *
 * @example
 * const { gestores, loading, fetchGestores } = useGestores();
 *
 * useEffect(() => {
 *   fetchGestores();
 * }, []);
 */
const useGestores = () => {
  const [gestores, setGestores] = useState<Array<Gestor>>([]);
  const [selectedGestor, setSelectedGestor] = useState<Gestor | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingGestor, setLoadingGestor] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { api } = useAuth();

  /**
   * Función para obtener la lista de gestores desde el backend. Establece el estado de carga en true antes de realizar la solicitud y lo vuelve a establecer en false después de recibir la respuesta o en caso de error. Si la solicitud es exitosa, actualiza el estado de gestores con los datos recibidos. Si ocurre un error, establece el estado de error con un mensaje descriptivo.
   */
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

  /**
   * Función para obtener la información de un gestor específico por su ID. Establece el estado de carga en true antes de realizar la solicitud y lo vuelve a establecer en false después de recibir la respuesta o en caso de error. Si la solicitud es exitosa, actualiza el estado de selectedGestor con los datos recibidos. Si ocurre un error, establece el estado de error con un mensaje descriptivo.
   *
   * @param id - El ID del gestor que se desea obtener.
   */
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

  /**
   * Función para agregar un nuevo gestor. Establece el estado de carga en true antes de realizar la solicitud y lo vuelve a establecer en false después de recibir la respuesta o en caso de error. Si la solicitud es exitosa, actualiza la lista de gestores. Si ocurre un error, establece el estado de error con un mensaje descriptivo.
   *
   * @param gestor - El objeto del gestor que se desea agregar. El campo "id" es opcional ya que se asignará automáticamente por el backend.
   * @throws {Error} Si el backend rechaza la creación del gestor, se lanza un error con un mensaje descriptivo que puede ser mostrado al usuario.
   */
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

  /**
   * Función para eliminar un gestor. Establece el estado de carga en true antes de realizar la solicitud y lo vuelve a establecer en false después de recibir la respuesta o en caso de error. Si la solicitud es exitosa, actualiza la lista de gestores.
   *
   * @param id - El ID del gestor que se desea eliminar.
   * @throws {Error} Si el backend rechaza la eliminación del gestor, se lanza un error con un mensaje descriptivo que puede ser mostrado al usuario.
   */
  const deleteGestor = async (id: number) => {
    try {
      await api.delete(`/gestores/${id}`);
      fetchGestores();
    } catch (error: any) {
      setError("Error al eliminar gestor.");
      throw error;
    }
  };

  /**
   * Función para actualizar la información de un gestor existente. Establece el estado de carga en true antes de realizar la solicitud y lo vuelve a establecer en false después de recibir la respuesta o en caso de error. Si la solicitud es exitosa, actualiza la lista de gestores.
   *
   * @param gestor - El objeto del gestor con los datos actualizados.
   * @param id - El ID del gestor que se desea actualizar.
   * @throws {Error} Si el backend rechaza la actualización del gestor, se lanza un error con un mensaje descriptivo que puede ser mostrado al usuario.
   */
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
