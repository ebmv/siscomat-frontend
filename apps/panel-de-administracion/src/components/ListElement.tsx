import { KebabMenu } from "./KebabMenu";

interface ListElementProps {
  nombre: string;
  fechaCreacion: string;
  onDelete?: () => void;
}

export const ListElement = ({ nombre, fechaCreacion, onDelete }: ListElementProps) => {
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