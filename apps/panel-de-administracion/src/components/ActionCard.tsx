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
      className="cursor-pointer transition-transform hover:scale-105 w-80 aspect-square
      "
    >
      <Card
        variant="white"
        className="items-center justify-center gap-4 w-full! h-full! p-4"
      >
        <div className="text-5xl text-brand-primary">
          <FontAwesomeIcon icon={icon} />
        </div>
        <h2 className="heading-2 text-center">{title}</h2>
      </Card>
    </div>
  );
};
