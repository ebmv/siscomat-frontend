import { useState, useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faFileArrowUp,
  faTimes,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@siscomat/shared-ui";
import { IconButton } from "./IconButton";

/**
 * Propiedades para el componente FileUploader.
 */
export interface FileUploaderProps {
  /**
   * Función que se ejecuta cuando el estado del archivo cambia.
   * @returns objeto File seleccionado o null si se elimina el archivo.
   */
  onFileSelect?: (file: File | null) => void;
  /**
   * Tipos de archivos permitidos para subir. Se pasa directamente al atributo "accept" del input de tipo file.
   * Ejemplo: "image/*" para permitir solo imágenes, ".pdf" para permitir solo archivos PDF, etc.
   */
  accept?: string;
}

/**
 * Zona interactiva para subir archivos. Soporta arrastrar y soltar archivos o seleccionar a través del explorador de archivos.
 *
 *  Muestra visualmente el estado del arrastre y una vez seleccionado el archivo renderiza una tarjeta con el nombre, tamaño y un botón para eliminarlo
 *
 * @example
 * <FileUploader
 *   accept=".pdf"
 *   onFileSelect={(file) => console.log("Archivo listo para subir:", file)}
 * />
 *
 * En este ejemplo, el componente FileUploader permite subir solo archivos PDF.
 */
export const FileUploader = ({ onFileSelect, accept }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (newFile: File) => {
    setFile(newFile);
    if (onFileSelect) onFileSelect(newFile);
  };

  const removeFile = () => {
    setFile(null);
    if (onFileSelect) onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-sm">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept={accept}
        className="hidden"
      />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`min-h-60 w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-all duration-200 ${
          isDragging
            ? "border-brand-primary bg-brand-subtle"
            : "border-brand-primary bg-white hover:bg-light-4"
        }`}
      >
        {isDragging ? (
          <>
            <FontAwesomeIcon
              icon={faFileArrowUp}
              className="text-4xl text-brand-lighter mb-4"
            />
            <span className="heading-5 text-dark-1">Subir archivo</span>
          </>
        ) : file ? (
          <>
            <FontAwesomeIcon
              icon={faCloudUploadAlt}
              className="text-4xl text-brand-subtle mb-6"
            />
            <div className="w-full flex items-center justify-between bg-light-3 p-3 rounded-md shadow-sm border border-light-2">
              <div className="flex items-center gap-3 overflow-hidden">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-dark-2 w-5 h-5 shrink-0"
                />
                <div className="flex flex-col truncate">
                  <span className="label-normal text-dark-1 truncate">
                    {file.name}
                  </span>
                  <span className="label-small text-dark-3">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
              <IconButton
                icon={faTimes}
                ariaLabel="Eliminar archiv"
                variant="error"
                onClick={removeFile}
              />
            </div>
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faCloudUploadAlt}
              className="text-4xl text-brand-subtle mb-4"
            />
            <span className="label-normal text-dark-3">
              Arrastra un archivo
            </span>
            <div className="flex items-center w-full my-4 px-4">
              <div className="flex-1 border-t border-light-2"></div>
              <span className="px-3 label-small text-dark-3">ó</span>
              <div className="flex-1 border-t border-light-2"></div>
            </div>

            <Button onClick={() => fileInputRef.current?.click()}>
              Elegir archivo
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
