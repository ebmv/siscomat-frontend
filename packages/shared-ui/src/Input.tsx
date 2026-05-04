import { type InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, disabled, className = "", ...props }, ref) => {
    const baseInput = [
      "w-full py-5 px-8 rounded-lg border bg-white outline-none transition-all duration-200",
      "label-normal text-dark-1 placeholder:text-dark-4",
      disabled
        ? "bg-light-2 border-light-1 text-dark-3 cursor-not-allowed"
        : error
        ? "border-error-primary focus:border-error-primary focus:ring-2 focus:ring-error-subtle"
        : "border-light-1 focus:border-brand-primary focus:ring-2 focus:ring-brand-subtle",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="body-large text-dark-3">
            {label}
          </label>
        )}

        <input
          ref={ref}
          disabled={disabled}
          className={baseInput}
          {...props}
        />

        {error && (
          <p className="text-xs font-label text-error-primary">{error}</p>
        )}

        {hint && !error && (
          <p className="text-xs font-label text-dark-3">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";