import { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary";
}

export const Button = ({
  label,
  variant = "primary",
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  const base =
    "flex w-full items-center justify-center px-14 py-3.5 rounded-lg label-large transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: disabled
      ? "bg-brand-subtle text-white cursor-not-allowed"
      : "bg-brand-primary text-white hover:bg-brand-lighter active:bg-brand-darker focus:ring-brand-primary",
    secondary: disabled
      ? "bg-light-2 text-dark-4 cursor-not-allowed"
      : "bg-light-2 text-dark-2 hover:bg-light-1 active:bg-dark-4 focus:ring-brand-primary",
  };

  return (
    <button
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};