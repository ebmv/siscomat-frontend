export default function Header() {
  return (
    <header className="bg-white flex items-center gap-4 px-6 py-3 shadow-sm">
      <img src="/web-app-manifest-192x192.png" alt="SISCOMAT" className="h-12 w-12" />
      <div>
        <p className="heading-3 text-dark-1">SISCOMAT</p>
        <p className="heading-4 text-dark-1">Universidad de Sonora</p>
      </div>
    </header>
  );
}