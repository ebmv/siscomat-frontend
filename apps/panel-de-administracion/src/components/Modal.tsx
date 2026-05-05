import type { ReactNode } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  maxWidth = "md",
}: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-2-3xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-1/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-card flex flex-col max-h-[90vh]`}
      >
        <div className="p-6 overflow-y-auto flex flex-col items-center text-center">
          {children}
        </div>
        ;
      </div>
    </div>
  );
};

interface ModalIconProps {
  icon: IconDefinition;
  variant: "success" | "info" | "warning" | "error";
}
export const ModalIcon = ({ icon, variant }: ModalIconProps) => {
  const variants = {
    success: "bg-success-subtle text-success-primary",
    info: "bg-info-subtle text-info-primary",
    warning: "bg-warning-subtle text-warning-primary",
    error: "bg-error-subtle text-error-primary",
  };
  return (
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-full mb-4 ${variants[variant]}`}
    >
      <FontAwesomeIcon icon={icon} />
    </div>
  );
};

export const ModalTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center p-4">
      <h3 className="heading-5">{title}</h3>
    </div>
  );
};

export const ModalActions = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-center gap-3 pt-4 px-4">
      {children}
    </div>
  );
};
