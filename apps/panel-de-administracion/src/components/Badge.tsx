/**
 * Variantes de color y estilo para el badge.
 */
export type BadgeVariant = "light" | "brand";

/**
 * Propiedades requeridas para el componente Badge.
 */
export interface BadgeProps {
  /**
   * Determina la paleta de colores del badge.
   * @default "light"
   */
  variant?: BadgeVariant;
  /**
   * Texto corto que se muestra dentro del badge.
   */
  label: string;
}

/**
 * Etiqueta visual compacta para resaltar estados, categorías o roles.
 *
 * @example
 * <Badge variant="light" label="Activo" />
 * <Badge variant="brand" label="Administrador" />
 *
 * En este ejemplo, el primer badge muestra un estado "Activo" con la variante "light", mientras que el segundo badge resalta el rol de "Administrador" con la variante "brand".
 */
export const Badge = ({ variant = "light", label }: BadgeProps) => {
  const variants: Record<BadgeVariant, string> = {
    light: "bg-light-3 border-t-light-4 text-dark-1",
    brand: "bg-brand-lighter border-t-brand-subtle text-light-4",
  };
  return (
    <div
      className={`inline-flex border-t rounded-md px-6 py-1  shadow-card label-normal ${variants[variant]}`}
    >
      {label}
    </div>
  );
};
