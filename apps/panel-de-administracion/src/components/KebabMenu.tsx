import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";

interface KebabMenuProps {
  onDelete: () => void;
}

export const KebabMenu = ({ onDelete }: KebabMenuProps) => {
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
    onDelete();
    setIsOpen(false);
  };

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
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-card z-10 overflow-hidden">
          <button
            onClick={handleDeleteClick}
            className="w-full flex items-center gap-3 px-4 py-3 label-normal text-error-primary text-left hover:bg-error-subtle transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faTrash} />
            <span className="label-normal text-dark-1">Eliminar</span>
          </button>
        </div>
      )}
    </div>
  );
};