import type { ReactNode } from "react";

interface ListContainerProps {
  children: ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}

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
