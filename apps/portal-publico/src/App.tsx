// Test componente
import { TestCard } from "@siscomat/shared-ui";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-light-3 p-10 flex flex-col items-center gap-6">
      <h1 className="heading-1">Portal público</h1>
      {/* Test Card */}
      <TestCard
        title="¡Monorepo funciona!"
        description="Esta tarjeta viene directamente desde shared-ui. Si Tailwind está bien configurado, verás esto con diseño, bordes y sombras."
      />
    </div>
  );
}

export default App;
