import { useState, useEffect } from "react";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ToastProps {
  mensaje: string;
  onClose: () => void;
}

export const Toast = ({ mensaje, onClose }: ToastProps) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!mensaje) return;

    setFadingOut(false);
    
    const showTimer = setTimeout(() => {
      setFadingOut(true);
      const closeTimer = setTimeout(() => {
        onClose();
      }, 500); 
      return () => clearTimeout(closeTimer);
    }, 3000); 

    return () => clearTimeout(showTimer);
  }, [mensaje, onClose]);

  if (!mensaje) return null;

  return (
    <div 
      className={`fixed bottom-10 left-1/2 -translate-x-1/2 bg-success-primary text-light-4 px-6 py-3 rounded-md shadow-card flex items-center gap-3 z-50 transition-opacity duration-500 ease-in-out ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
      <span className="label-normal font-bold">{mensaje}</span>
    </div>
  );
};