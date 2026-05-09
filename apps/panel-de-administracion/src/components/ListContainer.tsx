import type { ReactNode } from "react";

/**
 * Propiedades requeridas para el componente ListContainer.
 */
export interface ListContainerProps {
  /**
   * Los elementos de la lista a renderizar (generalmente componentes de tipo ListElement).
   */
  children: ReactNode;
  /**
   * Texto que se muestra cuando la propiedad isEmpty es verdadera.
   * @default "No hay elementos."
   */
  emptyMessage?: string;
  /**
   * Indica si la lista está vacía.
   * - Si es true, oculta los children y muestra el emptyMessage.
   * @default false
   */
  isEmpty?: boolean;
}

/**
 * Contenedor visual estandarizado para mostrar listas de elementos
 *
 *  Maneja automáticamente el estado vacío de la interfaz, mostrando un mensaje centrado en lugar de un área en blanco.
 *
 * @example
 * <ListContainer isEmpty={plantillas.length === 0} emptyMessage="No hay gestores registrados.">
 *  {plantillas.map(p => (
 *     <ListElement key={p.id} nombre={p.nombre} fechaCreacion={p.fecha} />
 *   ))}
 * </ListContainer>
 */
export const ListContainer = ({
  children,
  emptyMessage = "No hay elementos.",
  isEmpty = false,
}: ListContainerProps) => {
  return (
    <div className="w-full bg-light-3 rounded-md shadow-inset-top p-1 flex flex-col gap-2">
      {isEmpty ? (
        <p className="label-small text-dark-3 text-center py-2">
          {emptyMessage}
        </p>
      ) : (
        children
      )}
    </div>
  );
};
