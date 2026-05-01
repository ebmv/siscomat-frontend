export default function Box({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl py-10 px-16 w-[90%] max-w-2xl my-8">
      {children}
    </div>
  );
}