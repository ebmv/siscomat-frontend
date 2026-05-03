import type { ReactNode } from "react";

type CardVariant = "default" | "white";

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
}

export const Card = ({
  children,
  className = "",
  variant = "default",
}: CardProps) => {
  const variants = {
    default: "bg-light-4 border-t-white",
    white: "bg-white",
  };
  return (
    <div
      className={`${variants[variant]} rounded-2xl shadow-card w-full flex flex-col ${className}`}
    >
      {children}
    </div>
  );
};
