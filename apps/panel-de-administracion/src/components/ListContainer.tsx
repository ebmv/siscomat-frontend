import type { ReactNode } from "react";

interface ListContainerProps {
  children: ReactNode;
}

export const ListContainer = ({ children }: ListContainerProps) => {
  return (
    <div className="w-full bg-light-3 rounded-md shadow-inset-top overflow-y-auto p-1 flex flex-col gap-2">
      {children}
    </div>
  );
};
