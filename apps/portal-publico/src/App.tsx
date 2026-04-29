import { Input } from "@siscomat/shared-ui";
import { Button } from "@siscomat/shared-ui";

function App() {
  return (
    <div className="min-h-screen bg-white p-10 flex flex-col items-center gap-6">
      <h1 className="heading-1">Input/Button showcase (?)</h1>

      <div className="w-80 flex flex-col gap-4">
        {/* Inputs */}
        <Input label="Folio" placeholder="Ej. 2026-1234-56" />
        <Input label="Correo" placeholder="ola@ejemplo.com" />
        <Input label="Correo" value="texto inválido" error="Correo inválido" onChange={() => {}} />
        <Input label="Campo deshabilitado" value="Zainul Anshor" disabled />

        {/* Buttons primary */}
        <Button label="Default" onClick={() => {}} />
        <Button label="Disabled" disabled />

        {/* Buttons secondary */}
        <Button label="Default" variant="secondary" onClick={() => {}} />
        <Button label="Disabled" variant="secondary" disabled />
      </div>
    </div>
  );
}

export default App;
