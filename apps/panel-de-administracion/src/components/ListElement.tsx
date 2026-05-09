import { KebabMenu } from "./KebabMenu";

/**
 * Propiedades para el componente ListElement.
 */
export interface ListElementProps {
  /**
   * Nombre principal del registro a mostrar en la fila.
   */
  nombre: string;
  /**
   * Fecha en la que se registró el elemento en el sistema, ya debe estar formateada.
   */
  fechaCreacion: string;
  /**
   * Función para eliminar el registro.
   * Si no se proporciona el botón de eliminar se deshabilitará automáticamente.
   */
  onDelete?: () => void;
}

/**
 * Fila interactiva diseñada para los catálogos del sistema (Plantillas).
 *
 *  Renderiza la información básica del registro junto con un `KebabMenu`.
 * Contiene una regla de negocio visual integrada: si no recibe la propiedad `onDelete`,
 * asume que el registro está protegido (por constancias generadas) y bloquea la acción.
 *
 * @example
 * // Elemento que se puede eliminar:
 * <ListElement
 *   nombre="Plantilla de Participación"
 *   fechaCreacion="09/05/2026"
 *   onDelete={() => eliminarPlantilla(id)}
 * />
 *
 * // Elemento protegido (sin onDelete):
 * <ListElement
 *   nombre="Diploma de Excelencia"
 *   fechaCreacion="01/05/2026"
 */
export const ListElement = ({
  nombre,
  fechaCreacion,
  onDelete,
}: ListElementProps) => {
  return (
    <div className="flex items-center justify-between gap-8 px-4 py-2 bg-white rounded-md shadow-small hover:bg-brand-subtle transition-colors">
      <div className="flex flex-col">
        <span className="label-normal text-dark-1">
          {nombre} - {fechaCreacion}
        </span>
      </div>
      <div>
        <KebabMenu
          onDelete={onDelete}
          deleteDisabledReason={
            !onDelete
              ? "Esta plantilla no puede eliminarse porque ya existen constancias generadas con ella."
              : undefined
          }
        />
      </div>
    </div>
  );
};
