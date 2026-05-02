import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "../components/Box";

interface ConstanciaDetalle {
  id: string;
  participante: {
    folio: string;
    nombre: string;
    apellido_1: string;
    apellido_2: string;
  };
  curso: string;
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function Validar() {
  const { id } = useParams();
  const [constancia, setConstancia] = useState<ConstanciaDetalle | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Validar | SISCOMAT";
  }, []);

  useEffect(() => {
    async function fetchConstancia() {
      try {
        const res = await fetch(`${API_URL}/api/public/validar/${id}`);

        if (res.status === 404) {
          setError("No existe una constancia con ese id.");
          return;
        }

        if (!res.ok) {
          setError("Ocurrió un error. Intenta de nuevo.");
          return;
        }

        const data = await res.json();
        setConstancia(data);
      } catch {
        setError("No se pudo conectar al servidor.");
      } finally {
        setLoading(false);
      }
    }

    fetchConstancia();
  }, [id]);

  const fecha = constancia
    ? new Date(constancia.created_at).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : "";

  if (loading) {
    return (
      <Box>
        <p className="body-normal text-dark-3 text-center">Cargando...</p>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <p className="body-normal text-error-primary text-center">{error}</p>
      </Box>
    );
  }

  const nombre = `${constancia!.participante.nombre} ${constancia!.participante.apellido_1} ${constancia!.participante.apellido_2}`.trim();

  return (
    <Box>
      <h2 className="heading-3 text-center mb-2">Constancia auténtica</h2>
      <p className="body-normal text-dark-3 text-center m-2">
        Esta constancia fue emitida por SISCOMAT
        <br />
        y corresponde a:
      </p>

      <div className="flex flex-col divide-y divide-light-1">
        {[
          { label: "Participante", value: nombre },
          { label: "Folio", value: constancia!.participante.folio },
          { label: "Curso", value: constancia!.curso },
          { label: "Fecha de emisión", value: fecha },
        ].map((item) => (
          <div key={item.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-1">
            <span className="label-normal text-dark-2">{item.label}</span>
            <span className="label-large text-dark-1 sm:text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </Box>
  );
}