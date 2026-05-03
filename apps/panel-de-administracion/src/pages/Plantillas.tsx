import { useState, useEffect, useCallback } from "react";
import { Card, Button } from "@siscomat/shared-ui";
import { FileUploader, ListContainer, ListElement } from "../components";
import { useAuth } from "../components";

interface Plantilla {
  id: number;
  nombre: string;
  created_at: string;
}

const PLANTILLAS_POR_PAGINA = 3;

export const Plantillas = () => {
  const { api } = useAuth();
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [visibleCount, setVisibleCount] = useState(PLANTILLAS_POR_PAGINA);
  const [archivoError, setArchivoError] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [fileUploaderKey, setFileUploaderKey] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const fetchPlantillas = useCallback(async () => {
    try {
      const res = await api.get("/plantillas");
      setPlantillas(res.data);
    } catch {
      setGeneralError("No se pudieron cargar las plantillas.");
    }
  }, [api]);

  useEffect(() => {
    fetchPlantillas();
  }, [fetchPlantillas]);

  async function handleSubir() {
    let hasError = false;
    let nombreSinExtension = "";

    if (!archivo) {
      setArchivoError("Selecciona un archivo PDF.");
      hasError = true;
    } else {
      nombreSinExtension = archivo.name.substring(0, archivo.name.lastIndexOf('.')) || archivo.name;

      if (archivo.type !== "application/pdf") {
        setArchivoError("El archivo debe ser un PDF.");
        hasError = true;
      } else if (archivo.size > 5 * 1024 * 1024) {
        setArchivoError("El archivo no debe superar los 5 MB.");
        hasError = true;
      } else if (nombreSinExtension.length > 150) {
        setArchivoError("El nombre del archivo no puede superar los 150 caracteres.");
        hasError = true;
      } else {
        setArchivoError("");
      }
    }

    if (hasError) return;

    setGeneralError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("nombre", nombreSinExtension);
      formData.append("archivo", archivo!);

      await api.post("/plantillas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setArchivo(null);
      setFileUploaderKey((k) => k + 1);
      setVisibleCount(PLANTILLAS_POR_PAGINA);
      await fetchPlantillas();
    } catch {
      setGeneralError("Error al subir la plantilla.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePreview(id: number) {
    try {
      const res = await api.get(`/plantillas/${id}/archivo`, {
        responseType: "blob",
      });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(res.data);
      setPreviewUrl(url);
    } catch {
      setGeneralError("No se pudo cargar el preview.");
    }
  }

  async function handleEliminar(id: number) {
    try {
      await api.delete(`/plantillas/${id}`);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setGeneralError("");
      await fetchPlantillas();
    } catch {
      setGeneralError("Error al eliminar la plantilla.");
    }
  }

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const plantillasVisibles = plantillas.slice(0, visibleCount);
  const hayMas = visibleCount < plantillas.length;
  const hayMenos = visibleCount > PLANTILLAS_POR_PAGINA;

  return (
    // SE FUE EL items-center ALV y metimos contenedor centrado seguro
    <div className="w-full max-w-7xl mx-auto p-4 md:py-10 md:px-8 lg:px-16 flex flex-col gap-6">
      <Card className="w-full p-6 lg:px-10 lg:py-8">
        <h1 className="heading-2 text-center mb-8">Gestión de plantillas</h1>

        {generalError && (
          <p className="label-normal text-error-primary text-center mb-4">{generalError}</p>
        )}

        {/* w-full para evitar desbordes raros */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          
          {/* min-w-0 ayuda a flexbox a no volverse loco con anchos de los hijos */}
          <div className="flex flex-col gap-4 w-full lg:w-72 shrink-0 min-w-0">
            <h2 className="heading-5">Cargar plantilla</h2>
            
            <div className="flex flex-col gap-1 w-full">
              <FileUploader
                key={fileUploaderKey}
                accept="application/pdf"
                onFileSelect={setArchivo}
              />
              {archivoError && (
                <p className="text-xs font-label text-error-primary">{archivoError}</p>
              )}
            </div>
            <Button onClick={handleSubir} disabled={loading} className="w-full">
              {loading ? "Subiendo..." : "Subir plantilla"}
            </Button>

            <h2 className="heading-5 mt-4">Plantillas</h2>
            <ListContainer
              isEmpty={plantillasVisibles.length === 0}
              emptyMessage="No hay plantillas registradas."
            >
              {plantillasVisibles.map((p) => (
                <div key={p.id} onClick={() => handlePreview(p.id)} className="cursor-pointer">
                  <ListElement
                    nombre={p.nombre}
                    fechaCreacion={formatFecha(p.created_at)}
                    onDelete={() => handleEliminar(p.id)}
                  />
                </div>
              ))}
            </ListContainer>

            <div className="w-full flex items-center justify-center gap-4">
              {hayMenos && (
                <button
                  onClick={() => setVisibleCount(PLANTILLAS_POR_PAGINA)}
                  className="label-small text-dark-3 hover:text-dark-2 transition-colors cursor-pointer"
                >
                  Ver menos
                </button>
              )}
              {hayMas && (
                <button
                  onClick={() => setVisibleCount((c) => c + PLANTILLAS_POR_PAGINA)}
                  className="label-small text-brand-primary hover:text-brand-lighter transition-colors cursor-pointer"
                >
                  Ver más
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 bg-light-2 rounded-lg overflow-hidden min-h-96 w-full min-w-0">
            {previewUrl ? (
              <iframe
                src={previewUrl + "#toolbar=0"}
                className="w-full h-full min-h-96"
                title="Preview plantilla"
              />
            ) : (
              <div className="w-full h-full min-h-96 flex items-center justify-center p-4">
                <p className="label-normal text-dark-3 text-center">
                  Selecciona una plantilla para previsualizarla
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};