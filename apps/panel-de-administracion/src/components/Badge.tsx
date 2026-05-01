type BadgeVariant = "light" | "brand";

export interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
}
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
