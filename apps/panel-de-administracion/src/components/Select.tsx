import { useState, useRef, useEffect } from "react";

export interface Option<T extends string | number> {
  value: T;
  label: string;
}

export interface SelectProps<T extends string | number> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
}

export const Select = <T extends string | number>({
  options = [],
  value,
  onChange,
  placeholder = "Seleccionar...",
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const handleSelect = (option: Option<T>) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-light-1 rounded-md label-normal focus:outline-none focus:ring-2 focus:ring-brand-subtle transition-all"
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
        <ul className="absolute z-10 w-full mt-1 bg-white border border-light-1 rounded-md shadow-card max-h-60 overflow-y-auto">
          {options.map((option) => {
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
      )}
    </div>
  );
};
