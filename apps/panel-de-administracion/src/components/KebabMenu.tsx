import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";

interface KebabMenuProps {
  onDelete?: () => void;
  deleteDisabledReason?: string;
}

export const KebabMenu = ({ onDelete, deleteDisabledReason }: KebabMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete();
      setIsOpen(false);
    }
  };

  const disabled = !onDelete;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center text-dark-1 hover:bg-light-4 hover:text-dark-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-subtle cursor-pointer"
        aria-label="Abrir opciones"
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-card z-50 overflow-hidden">
          <button
            onClick={handleDeleteClick}
            disabled={disabled}
            className={`w-full flex flex-col px-4 py-3 text-left transition-colors ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-error-subtle cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faTrash} className="text-error-primary" />
              <span className="label-normal text-dark-1">Eliminar</span>
            </div>
            {disabled && deleteDisabledReason && (
              <p className="label-small text-dark-3 mt-1 ml-6">{deleteDisabledReason}</p>
            )}
          </button>
        </div>
      )}
    </div>
  );
};