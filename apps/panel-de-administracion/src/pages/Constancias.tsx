import { useState, useEffect, useCallback } from "react";
import { Card, Button, Toast } from "@siscomat/shared-ui";
import { FileUploader, Select, Modal, ModalIcon, ModalTitle, ModalActions } from "../components";
import { useAuth } from "../components";
import { faCheckCircle, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Representa la estructura de un registro extraído del archivo CSV.
 * Conserva el número de fila original (originalRow) para referenciar errores de validación.
 */
interface ParticipanteCSV {
  originalRow: number;
  folio: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  curso: string;
}

/**
 * Representa una plantilla de constancia obtenida desde el servidor.
 */
interface Plantilla {
  id: number;
  nombre: string;
  created_at: string;
}

export const Constancias = () => {
  const { api } = useAuth();
  
  // Estados de datos principales
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [participantes, setParticipantes] = useState<ParticipanteCSV[]>([]);
  const [archivoSubido, setArchivoSubido] = useState<File | null>(null);
  
  // Estados de selección y previsualización
  const [fileUploaderKey, setFileUploaderKey] = useState(0);
  const [selectedPlantillaId, setSelectedPlantillaId] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Estados de control de UI y procesos asíncronos
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validacionData, setValidacionData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [seReordeno, setSeReordeno] = useState(false);
  
  // Estados para retroalimentación al usuario
  const [mensajeToast, setMensajeToast] = useState("");
  const [errorCSV, setErrorCSV] = useState("");

  /**
   * Obtiene el listado de plantillas disponibles desde el backend.
   */
  const fetchPlantillas = useCallback(async () => {
    try {
      const res = await api.get("/plantillas");
      setPlantillas(res.data);
    } catch (error) {
      console.error("Error al cargar plantillas", error);
    }
  }, [api]);

  useEffect(() => {
    fetchPlantillas();
  }, [fetchPlantillas]);

  /**
   * Procesa localmente el archivo CSV seleccionado por el usuario.
   * Extrae los encabezados, mapea los datos a la interfaz ParticipanteCSV
   * y reinicia los estados de validación y previsualización.
   */
  const handleCSVUpload = (file: File | null) => {
    setErrorCSV("");
    setArchivoSubido(file);
    setValidacionData(null); 
    setSeReordeno(false); 

    if (!file) {
      setParticipantes([]);
      setSelectedIndex(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lineas = text.split('\n').filter(l => l.trim() !== '');
      
      if (lineas.length < 2) {
        setErrorCSV("El archivo CSV está vacío o no tiene encabezados.");
        return;
      }

      const headers = lineas[0].toLowerCase().split(',').map(h => h.trim());
      const filas = lineas.slice(1);
      
      const parsedData: ParticipanteCSV[] = filas.map((fila, index) => {
        const valores = fila.split(',').map(v => v.trim());
        return {
          originalRow: index + 2, 
          folio: valores[headers.indexOf('folio')] || "",
          nombre: valores[headers.indexOf('nombre')] || "",
          apellido1: valores[headers.indexOf('apellido1')] || "",
          apellido2: valores[headers.indexOf('apellido2')] || "",
          curso: valores[headers.indexOf('curso')] || "",
        };
      }); 

      setParticipantes(parsedData);
      setSelectedIndex(null); 
    };
    reader.readAsText(file);
  };

  /**
   * Efecto encargado de solicitar la previsualización del documento PDF al backend.
   * Se dispara automáticamente cuando cambia la plantilla o la fila seleccionada.
   */
  useEffect(() => {
    const fetchPreview = async () => {
      if (!selectedPlantillaId) {
        setPreviewUrl(null);
        return;
      }

      setLoadingPreview(true);

      try {
        if (selectedIndex !== null && participantes[selectedIndex]) {
          // Previsualización de un participante específico con la plantilla seleccionada
          const p = participantes[selectedIndex];
          const nombreCompleto = [p.nombre, p.apellido1, p.apellido2].filter(Boolean).join(" ").trim();

          const res = await api.post("/constancias/previsualizar", {
            folio: p.folio,
            nombre_participante: nombreCompleto,
            nombre_curso: p.curso,
            plantilla_id: selectedPlantillaId
          });

          const base64Response = await fetch(`data:application/pdf;base64,${res.data.archivo_base64}`);
          const blob = await base64Response.blob();
          const url = URL.createObjectURL(blob);
          
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(url);
        } 
        else {
          // Previsualización general de la plantilla base (sin datos inyectados)
          const res = await api.get(`/plantillas/${selectedPlantillaId}/archivo`, { responseType: "blob" });
          const url = URL.createObjectURL(res.data);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(url);
        }
      } catch (error) {
        console.error("Error cargando previsualización", error);
      } finally {
        setLoadingPreview(false);
      }
    };

    fetchPreview();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlantillaId, selectedIndex]);

  /**
   * Envía el archivo CSV al backend indicando que solo se requiere validación (solo_validar = true).
   * Almacena los resultados de validación y despliega el modal de confirmación.
   */
  const handleValidarCSV = async () => {
    if (!selectedPlantillaId || !archivoSubido) return;
    
    setIsValidating(true);

    try {
      const formData = new FormData();
      formData.append("plantilla_id", selectedPlantillaId.toString());
      formData.append("archivo", archivoSubido);
      formData.append("solo_validar", "true"); 

      const res = await api.post("/constancias/cargar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setValidacionData(res.data);
      setShowModal(true);
    } catch (error: any) {
      const msg = error.response?.data?.error || "Ocurrió un error al validar el archivo.";
      const detalle = error.response?.data?.detalle;
      setMensajeToast(detalle ? `${msg} ERROR: ${detalle}` : msg);
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Ejecuta el proceso definitivo de generación de constancias en el backend (solo_validar = false).
   * Tras una respuesta exitosa, reinicia el estado general del componente.
   */
  const handleConfirmarGeneracion = async () => {
    if (!selectedPlantillaId || !archivoSubido) return;
    
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append("plantilla_id", selectedPlantillaId.toString());
      formData.append("archivo", archivoSubido);
      formData.append("solo_validar", "false"); 

      await api.post("/constancias/cargar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMensajeToast("¡Constancias generadas exitosamente!");
      setShowModal(false);
      setValidacionData(null);
      setSeReordeno(false);
      setArchivoSubido(null);
      setParticipantes([]);
      setSelectedIndex(null);
      setPreviewUrl(null);
      setSelectedPlantillaId(null);
      setFileUploaderKey(k => k + 1);
    } catch (error: any) {
      const msg = error.response?.data?.error || "Ocurrió un error al procesar el archivo.";
      setMensajeToast(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Cierra el modal de confirmación.
   * Si existen errores detectados durante la validación, reordena la tabla principal
   * moviendo los registros defectuosos a la parte superior para su fácil visualización.
   */
  const handleCancelar = () => {
    setShowModal(false);
    
    if (validacionData?.errores && validacionData.errores.length > 0) {
      const participantesOrdenados = [...participantes].sort((a, b) => {
        const aHasError = validacionData.errores.some((e: any) => e.fila === a.originalRow);
        const bHasError = validacionData.errores.some((e: any) => e.fila === b.originalRow);
        
        if (aHasError && !bHasError) return -1;
        if (!aHasError && bHasError) return 1;
        
        return a.originalRow - b.originalRow;
      });

      setParticipantes(participantesOrdenados);
      setSeReordeno(true); 
      setSelectedIndex(null); 
    }
  };

  /**
   * Da formato de presentación a las fechas (DD/MM/AAAA).
   */
  const formatFecha = (fecha: string) => {
    if(!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Ordena las plantillas por fecha descendente para su visualización en el componente Select
  const plantillasOptions = [...plantillas]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(p => ({
      value: p.id,
      label: `${p.nombre} (${formatFecha(p.created_at)})`
    }));

  return (
    <div className="relative w-full max-w-7xl mx-auto p-4 md:py-10 md:px-8 lg:px-16 flex flex-col gap-6">
      <Toast mensaje={mensajeToast} onClose={() => setMensajeToast("")} />

      {/* Modal de confirmación de generación y resumen de validación */}
      <Modal isOpen={showModal} onClose={handleCancelar}>
        <ModalIcon 
            icon={validacionData?.errores?.length > 0 ? faTriangleExclamation : faCheckCircle} 
            variant={validacionData?.errores?.length > 0 ? "warning" : "success"} 
        />
        <ModalTitle title="Confirmación de generación" />
        
        <div className="flex flex-col gap-4 w-full px-2">
            <p className="label-normal text-dark-1 text-center">
                Se pueden generar constancias para <strong>{validacionData?.constanciasGeneradas}</strong> filas.
                {validacionData?.errores?.length > 0 && (
                    <span> Mientras que <strong>{validacionData.errores.length}</strong> filas presentan errores.</span>
                )}
            </p>
            
            <p className="label-small text-dark-3 text-center mt-1 mb-2">
                Presionar "Sí, generar" procesará las filas correctas e ignorará las que tienen errores.
            </p>

            {validacionData?.errores && validacionData.errores.length > 0 && (
                <div className="mt-2 p-4 bg-error-primary/10 border border-error-primary/30 rounded-md text-sm text-error-primary max-h-60 overflow-y-auto text-left">
                    <p className="font-bold mb-3">Filas con errores ({validacionData.errores.length}):</p>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                        {validacionData.errores.map((e: any, i: number) => (
                            <li key={i}>
                                <strong>Fila {e.fila}:</strong> <span dangerouslySetInnerHTML={{ __html: e.motivo }} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        
        <ModalActions>
            <div className="w-full sm:w-40">
                <Button variant="secondary" onClick={handleCancelar} disabled={isGenerating}>
                    Cancelar
                </Button>
            </div>
            <div className="w-full sm:w-40">
                <Button 
                    variant="primary" 
                    onClick={handleConfirmarGeneracion} 
                    disabled={isGenerating || validacionData?.constanciasGeneradas === 0}
                >
                    {isGenerating ? "Generando..." : "Sí, generar"}
                </Button>
            </div>
        </ModalActions>
      </Modal>

      <Card className="p-6 lg:p-10 gap-8">
        
        <div className="relative flex justify-center items-center w-full pb-2">
          <h1 className="heading-2 text-dark-1 text-center w-full">Generar constancias</h1>
          <div className="absolute right-0 hidden md:block">
            <Button 
              onClick={handleValidarCSV} 
              disabled={!selectedPlantillaId || participantes.length === 0 || isValidating}
            >
              {isValidating ? "Validando..." : "Generar constancias"}
            </Button>
          </div>
        </div>
        <div className="w-full flex justify-center md:hidden">
            <Button 
              onClick={handleValidarCSV} 
              disabled={!selectedPlantillaId || participantes.length === 0 || isValidating}
            >
              {isValidating ? "Validando..." : "Generar constancias"}
            </Button>
        </div>

        {/* Sección superior: Carga de archivo CSV y Selección de plantilla base */}
        <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
          
          <Card className="w-full lg:w-3/5 p-6 gap-4 shadow-card rounded-md border border-light-2 flex flex-col justify-center">
            <h2 className="heading-5">Cargar participantes</h2>
            <div className="w-full mt-2 flex justify-center [&>div>div]:min-h-40 [&>div>div]:p-6">
              <FileUploader
                key={fileUploaderKey}
                accept=".csv"
                onFileSelect={handleCSVUpload}
              />
            </div>
            {errorCSV && <p className="label-small text-error-primary mt-2 text-center">{errorCSV}</p>}
          </Card>

          <Card className="relative z-20 w-full lg:w-2/5 p-6 gap-4 shadow-card rounded-md border border-light-2 flex flex-col justify-center">
            <h2 className="heading-5">Seleccionar plantilla</h2>
            <div className="mt-2 w-full">
              <Select
                options={plantillasOptions}
                value={selectedPlantillaId as any} 
                onChange={(val) => setSelectedPlantillaId(val)}
                placeholder="Seleccione una plantilla..."
                itemsPerPage={3}
              />
            </div>
          </Card>

        </div>

        {/* Contenedor principal inferior: Tabla de datos y Previsualizador de PDF */}
        <div className="flex flex-col lg:flex-row gap-6 w-full lg:h-125">
          
          <Card className="w-full lg:w-3/5 overflow-hidden shadow-card rounded-md border border-light-2 flex flex-col h-100 lg:h-full">
            
            {seReordeno && (
               <div className="bg-warning-subtle border-b border-warning-primary/20 py-3 px-4 flex flex-col items-center justify-center gap-1 text-warning-darker text-center">
                 <div className="flex items-center gap-2 font-bold label-small">
                     <FontAwesomeIcon icon={faTriangleExclamation} className="text-base" />
                     <span>Atención: Inconsistencias detectadas</span>
                 </div>
                 <p className="label-small text-dark-1">
                     La lista se ordenó para mostrar los errores primero. Pase el cursor sobre el ícono de advertencia para ver el detalle. Corrija los datos y vuelva a cargar el archivo CSV.
                 </p>
               </div>
            )}

            {participantes.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <p className="label-normal text-dark-3 text-center">Sube un archivo CSV para ver los participantes</p>
              </div>
            ) : (
              <div className="overflow-auto w-full h-full">
                <table className="w-full text-center border-collapse relative">
                  <thead className="bg-dark-4 border-b border-light-2 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 heading-6 tracking-wider text-dark-1 w-32 min-w-20">Fila</th>
                      <th className="px-4 py-3 heading-6 tracking-wider text-dark-1">Folio</th>
                      <th className="px-4 py-3 heading-6 tracking-wider text-dark-1">Nombre</th>
                      <th className="px-4 py-3 heading-6 tracking-wider text-dark-1">Curso</th>
                      <th className="px-4 py-3 heading-6 tracking-wider text-dark-1 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-2">
                    {participantes.map((p, index) => {
                      const numFila = p.originalRow; 
                      const errorInfo = validacionData?.errores?.find((e: any) => e.fila === numFila);

                      return (
                        <tr 
                          key={`${p.folio}-${index}`}
                          onClick={() => setSelectedIndex(index)}
                          className={`cursor-pointer transition-colors ${
                            errorInfo 
                              ? "bg-error-primary/10 hover:bg-error-primary/20" 
                              : selectedIndex === index 
                                ? "bg-brand-subtle" 
                                : "hover:bg-light-4"
                          }`}
                        >
                          <td className="px-4 py-3 label-normal text-dark-2 font-bold">{numFila}</td>
                          <td className="px-4 py-3 label-normal text-dark-1">{p.folio}</td>
                          <td className="px-4 py-3 label-normal text-dark-1">{`${p.nombre} ${p.apellido1} ${p.apellido2}`.trim()}</td>
                          <td className="px-4 py-3 label-normal text-dark-1">{p.curso}</td>
                          <td className="px-4 py-3">
                            {errorInfo && (
                                <div title={errorInfo.motivo.replace(/<[^>]+>/g, '')} className="text-error-primary flex items-center justify-center text-lg">
                                    <FontAwesomeIcon icon={faTriangleExclamation} />
                                </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card variant="white" className="w-full lg:w-2/5 overflow-hidden shadow-card rounded-md border border-light-2 relative flex flex-col p-4 h-100 lg:h-full">
            {loadingPreview && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 backdrop-blur-sm">
                <div className="bg-white p-4 rounded-lg shadow-card">
                   <p className="label-large text-brand-primary">Cargando previsualización...</p>
                </div>
              </div>
            )}
            
            {previewUrl ? (
              <iframe
                src={previewUrl + "#toolbar=0"}
                className="w-full h-full border border-light-2 rounded-sm bg-white"
                title="Preview constancia"
              />
            ) : (
              <div className="w-full h-full bg-light-3 border border-light-2 rounded-sm flex items-center justify-center p-4">
                 <p className="label-normal text-dark-3 text-center">
                    Selecciona una plantilla y un participante
                 </p>
              </div>
            )}
          </Card>

        </div>
      </Card>
    </div>
  );
};