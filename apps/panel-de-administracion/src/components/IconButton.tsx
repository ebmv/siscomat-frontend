import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface IconButtonProps {
  icon: IconDefinition;
  onClick?: () => void;
  ariaLabel: string;
  variant?: "info" | "error";
  disabled?: boolean;
}

export const IconButton = ({
  icon,
  onClick,
  ariaLabel,
  variant = "info",
  disabled = false,
}: IconButtonProps) => {
  const variants = {
    info: "text-info-primary hover:text-info-lighter",
    error: "text-error-primary hover:text-error-lighter",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-subtle ${
        disabled ? "opacity-50 cursor-not-allowed" : variants[variant]
      }`}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};
