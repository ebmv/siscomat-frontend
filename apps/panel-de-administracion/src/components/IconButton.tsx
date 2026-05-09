import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/**
 * Propiedades requeridas para el componente IconButton.
 */
export interface IconButtonProps {
  /**
   * Ícono importado de FontAwesome.
   */
  icon: IconDefinition;
  /**
   * Función que se ejecuta al hacer clic.
   */
  onClick?: () => void;
  /**
   * Texto descriptivo obligatorio para lectores de pantalla.
   * @example "Cerrar ventana" o "Eliminar usuario"
   */
  ariaLabel: string;
  /**
   * Determina el color y propósito del botón.
   * @default "info"
   */
  variant?: "info" | "error";
  /**
   * Si es true, deshabilita la interacción y reduce la opacidad.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Botón compacto que muestra únicamente un ícono, sin texto visible.
 *
 *  Ideal para acciones secundarias como eliminar, editar o cerrar. Incluye estilos de enfoque para accesibilidad y cambia de color al hacer hover, a menos que esté deshabilitado.
 *
 * @example
 * <IconButton
 *   icon={faTimes}
 *   onClick={() => console.log("Cerrar ventana")}
 *   ariaLabel="Cerrar ventana"
 *   variant="error"
 * />
 *
 * En este ejemplo, el IconButton muestra un ícono de "X" con un color que indica una acción de error. Al hacer clic en el botón, se registra "Cerrar ventana" en la consola. El atributo ariaLabel asegura que los lectores de pantalla describan correctamente la función del botón.
 */
export const IconButton = ({
  icon,
  onClick,
  ariaLabel,
  variant = "info",
  disabled = false,
}: IconButtonProps) => {
  const variants = {
    info: "text-info-primary hover:text-info-lighter",
    error: "text-error-primary hover:text-error-lighter",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-subtle ${
        disabled ? "opacity-50 cursor-not-allowed" : variants[variant]
      }`}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};
