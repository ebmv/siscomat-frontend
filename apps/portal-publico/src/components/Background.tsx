import "./Background.css";

export default function Background({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex-1 bg-brand-primary flex items-center justify-center overflow-hidden">
      <div className="circle circle-1" />
      <div className="circle circle-2" />
      <div className="circle circle-3" />
      <div className="circle circle-4" />
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}