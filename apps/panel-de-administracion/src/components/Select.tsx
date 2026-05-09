import { useState, useRef, useEffect } from "react";

/**
 * Representa una opción individual en el componente Select.
 * @template T El tipo de dato del valor de la opción, restringido a texto o números.
 */
export interface Option<T extends string | number> {
  value: T;
  label: string;
}

/**
 * Propiedades para el componente Select.
 * @template T el tipo de dato del valor seleccionado.
 */
export interface SelectProps<T extends string | number> {
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  /**
   * @default "Seleccionar..."
   */
  placeholder?: string;
  /**
   * Clases adicionales de Tailwind para personalizar el estilo del dropdown.
   */
  dropdownClassName?: string;
  /**
   * Si se define, activa la "paginación interna" del menú.
   * Mostrará esta cantidad de elementos inicialmente junto con botones de "Ver más" / "Ver menos".
   */
  itemsPerPage?: number;
}

/**
 * Menú desplegable (Dropdown) personalizado y altamente interactivo.
 *
 *
 * Reemplaza el elemento `<select>` nativo del navegador para permitir estilos consistentes.
 * Incluye lógica de "clic afuera" para cerrarse automáticamente y soporte para listas largas
 * mediante su función de "Ver más / Ver menos" (controlada por `itemsPerPage`).
 *
 * @example
 * // Uso básico con strings:
 * <Select
 *   options={[{ value: "A", label: "Activo" }, { value: "I", label: "Inactivo" }]}
 *   value={estadoActual}
 *   onChange={(val) => setEstado(val)}
 * />
 *
 * // Uso avanzado con números y paginación para listas largas:
 * <Select<number>
 *   options={listaDeIds}
 *   value={idSeleccionado}
 *   onChange={(id) => buscarPorId(id)}
 *   itemsPerPage={5}
 *   placeholder="Seleccione un gestor..."
 * />
 */
export const Select = <T extends string | number>({
  options = [],
  value,
  onChange,
  placeholder = "Seleccionar...",
  dropdownClassName = "",
  itemsPerPage,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Iniciamos mostrando itemsPerPage o todos si no se especifica
  const [visibleCount, setVisibleCount] = useState<number>(
    itemsPerPage || options.length,
  );
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen && itemsPerPage) {
      setTimeout(() => setVisibleCount(itemsPerPage), 200);
    }
  }, [isOpen, itemsPerPage]);

  const handleSelect = (option: Option<T>) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  // Lógica de partición
  const visibleOptions = itemsPerPage
    ? options.slice(0, visibleCount)
    : options;
  const hayMas = itemsPerPage ? visibleCount < options.length : false;
  const hayMenos = itemsPerPage ? visibleCount > itemsPerPage : false;

  const defaultHeightClass =
    !itemsPerPage && !dropdownClassName ? "max-h-60" : dropdownClassName;

  return (
    <div className="relative w-full" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-light-1 rounded-md label-normal focus:outline-none focus:ring-2 focus:ring-brand-subtle transition-all cursor-pointer"
      >
        <span className="label-normal text-dark-1">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-dark-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute z-10 w-full mt-1 bg-white border border-light-1 rounded-md shadow-card flex flex-col overflow-hidden ${defaultHeightClass}`}
        >
          <ul className="overflow-y-auto w-full max-h-60">
            {visibleOptions.map((option) => {
              const isSelected = value === option.value;
              return (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2 cursor-pointer label-normal transition-colors ${
                    isSelected
                      ? "bg-brand-primary text-white"
                      : "text-dark-1 hover:bg-light-4"
                  }`}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>

          {/* Botones de ver más/menos... */}
          {itemsPerPage && options.length > itemsPerPage && (
            <div className="w-full flex items-center justify-center gap-4 py-2 border-t border-light-2 bg-light-4 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]">
              {hayMenos && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVisibleCount(itemsPerPage);
                  }}
                  className="label-small text-dark-3 hover:text-dark-2 transition-colors cursor-pointer"
                >
                  Ver menos
                </button>
              )}
              {hayMas && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVisibleCount((c) => c + itemsPerPage);
                  }}
                  className="label-small text-brand-primary hover:text-brand-lighter transition-colors cursor-pointer"
                >
                  Ver más
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
