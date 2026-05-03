import { Card } from "@siscomat/shared-ui";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ActionCardProps {
  title: string;
  icon: IconDefinition;
  onClick: () => void;
}

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
