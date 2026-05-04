import { useState, useEffect } from "react";
import { Input, Button } from "@siscomat/shared-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Box from "../components/Box";

interface Constancia {
  id: string;
  curso: string;
}

interface ResultadoBusqueda {
  folio: string;
  nombre: string;
  apellido_1: string;
  apellido_2: string;
  constancias: Constancia[];
}

const API_URL = import.meta.env.VITE_API_URL;

export default function ConsultarFlow() {
  const [folio, setFolio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [descargando, setDescargando] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoBusqueda | null>(null);

  useEffect(() => {
    document.title = "Consultar | SISCOMAT";
  }, []);

  async function handleBuscar() {
    if (!folio.trim()) {
      setError("Ingresa un folio.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/public/constancia/${folio.trim()}`);

      if (res.status === 404) {
        setError("No existe un participante con ese folio.");
        return;
      }

      if (!res.ok) {
        setError("Ocurrió un error. Intenta de nuevo.");
        return;
      }

      const data = await res.json();
      setResultado(data);
    } catch {
      setError("No se pudo conectar al servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDescargar(id: string) {
    setDescargando(id);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/public/constancia/${id}/pdf`);

      if (!res.ok) {
        setError("No se pudo descargar la constancia.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `constancia_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("No se pudo conectar al servidor.");
    } finally {
      setDescargando(null);
    }
  }

  function handleRegresar() {
    setResultado(null);
    setFolio("");
    setError("");
  }

  if (resultado) {
    const nombre = `${resultado.nombre} ${resultado.apellido_1} ${resultado.apellido_2}`.trim();

    return (
      <Box>
        <button
          onClick={handleRegresar}
          className="flex items-center gap-2 text-dark-4 heading-6 mb-6 hover:text-dark-3 transition-colors w-fit cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Regresar
        </button>

        <h2 className="heading-3 mb-1">{nombre}</h2>
        <p className="body-normal text-dark-2 mb-6">
          {resultado.constancias.length} constancia(s) disponible(s):
        </p>

        {error && (
          <p className="label-normal text-error-primary mb-4">{error}</p>
        )}

        <div className="flex flex-col divide-y divide-light-1">
          {resultado.constancias.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 py-4">
              <span className="label-large text-dark-1 truncate min-w-0" title={c.curso}>
                {c.curso}
              </span>
              <div className="w-28 shrink-0">
                <Button
                  variant="secondary"
                  disabled={descargando === c.id}
                  onClick={() => handleDescargar(c.id)}
                >
                  {descargando === c.id ? "..." : "Descargar"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Box>
    );
  }

  return (
    <Box>
      <h2 className="heading-3 text-center mb-8">Buscar constancia</h2>
      <div className="flex flex-col gap-6">
        <Input
          label="Folio"
          placeholder="Ej. 2026-1234-56"
          value={folio}
          error={error}
          onChange={(e) => {
            const valor = e.target.value.replace(/[^0-9]/g, "");
            const formateado = valor
              .replace(/^(\d{4})(\d{0,4})/, "$1-$2")
              .replace(/^(\d{4}-\d{4})(\d{0,2})/, "$1-$2");
            setFolio(formateado);
          }}
        />
        <Button onClick={handleBuscar} disabled={loading}>
          {loading ? "Buscando..." : "Buscar constancia"}
        </Button>
      </div>
    </Box>
  );
}