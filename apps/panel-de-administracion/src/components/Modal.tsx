import type { ReactNode } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/**
 * Propiedades para el componente Modal.
 */
export interface ModalProps {
  /**
   * Determina si el modal está visible en pantalla.
   */
  isOpen: boolean;
  /**
   * Función para cerrar el modal. Se dispara al hacer clic fuera del modal o presionar la tecla Escape.
   */
  onClose: () => void;
  /**
   * Contenido interno del modal. Se recomienda usar ModalIcon, ModalTitle y ModalActions.
   */
  children: ReactNode;
  /**
   * Define el ancho máximo del contenedor.
   * @default "md"
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

/**
 * Contenedor principal para modales.
 *
 * Bloquea la interacción con el fondo y cuenta con atajos de teclado nativos.
 *
 * @example
 * <Modal isOpen={true} onClose={() => setOpen(false)} maxWidth="sm">
 *   <ModalIcon icon={faWarning} variant="warning" />
 *   <ModalTitle title="¿Desea continuar?" />
 *   <p className="text-dark-2 my-4">Esta acción no se puede deshacer.</p>
 *   <ModalActions>
 *     <Button onClick={cancelar}>Cancelar</Button>
 *     <Button variant="primary" onClick={confirmar}>Aceptar</Button>
 *   </ModalActions>
 * </Modal>
 */
export const Modal = ({
  isOpen,
  onClose,
  children,
  maxWidth = "md",
}: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-1/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-card flex flex-col max-h-[90vh]`}
      >
        <div className="p-6 overflow-y-auto flex flex-col items-center text-center">
          {children}
        </div>
        ;
      </div>
    </div>
  );
};

/**
 * Propiedades para el ícono decorativo del modal.
 */
export interface ModalIconProps {
  icon: IconDefinition;
  /** Define la paleta de colores del círculo de fondo y el ícono */
  variant: "success" | "info" | "warning" | "error";
}

/**
 * Subcomponente de Modal para mostrar un ícono decorativo que refuerce el mensaje del modal.
 */
export const ModalIcon = ({ icon, variant }: ModalIconProps) => {
  const variants = {
    success: "bg-success-subtle text-success-primary",
    info: "bg-info-subtle text-info-primary",
    warning: "bg-warning-subtle text-warning-primary",
    error: "bg-error-subtle text-error-primary",
  };
  return (
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-full mb-4 ${variants[variant]}`}
    >
      <FontAwesomeIcon icon={icon} />
    </div>
  );
};

/**
 * Subcomponente de Modal para mostrar un título.
 */
export const ModalTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center p-4">
      <h3 className="heading-5">{title}</h3>
    </div>
  );
};

/**
 * Subcomponente de Modal para mostrar botones de acción.
 */
export const ModalActions = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-center gap-3 pt-4 px-4">
      {children}
    </div>
  );
};
