import { Card } from "@siscomat/shared-ui";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Propiedades del componente ActionCard.
 */
export interface ActionCardProps {
  /**
   * Texto principal que describe la acción, se muestra centrado debajo del ícono.
   */
  title: string;
  /**
   * Ícono importado de FontAwesome que representa visualmente la acción.
   */
  icon: IconDefinition;
  /**
   * Función que se dispara al hacer clic en cualquier parte de la tarjeta.
   */
  onClick: () => void;
}

/**
 * Tarjeta interactiva diseñada para usarse como un botón de acción grande.
 *
 * Incluye un efecto visual de escala al hacer hover.
 * Se adapta a diferentes tamaños de pantalla, mostrando el ícono y el título centrados tanto vertical como horizontalmente.
 *
 * @example
 * import { faUser } from "@fortawesome/free-solid-svg-icons";
 *
 * <ActionCard
 *   title="Gestionar Usuarios"
 *   icon={faUser}
 *   onClick={() => navigate("/usuarios")}
 * />
 *
 * En este ejemplo, se muestra una tarjeta con el ícono de usuario y el título "Gestionar Usuarios". Al hacer clic en la tarjeta, se navega a la ruta "/usuarios".
 */
export const ActionCard = ({ title, icon, onClick }: ActionCardProps) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer transition-transform hover:scale-105 w-full sm:w-72 md:w-80 aspect-auto sm:aspect-square"
    >
      <Card
        variant="white"
        className="items-center justify-center gap-3 w-full! h-full! py-6 px-6 sm:p-4"
      >
        <div className="text-4xl sm:text-5xl text-brand-primary">
          <FontAwesomeIcon icon={icon} />
        </div>
        <h2 className="heading-3 sm:heading-2 text-center">{title}</h2>
      </Card>
    </div>
  );
};
