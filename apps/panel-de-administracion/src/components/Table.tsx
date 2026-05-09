import type { FC } from "react";
import React from "react";

/**
 * Contenedor principal responsivo para tablas de datos del sistema.
 *
 *  Utiliza el patrón de "Componentes Compuestos" para garantizar
 * consistencia visual en todas las tablas sin perder la flexibilidad de HTML nativo.
 * Su contenedor exterior maneja el desbordamiento (overflow) para que la tabla sea "scrollable"
 * horizontalmente en dispositivos móviles.
 *
 * @example
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Nombre</TableHead>
 *       <TableHead>Rol</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     {usuarios.map(u => (
 *       <TableRow key={u.id}>
 *         <TableCell>{u.nombre}</TableCell>
 *         <TableCell><Badge label={u.rol} /></TableCell>
 *       </TableRow>
 *     ))}
 *   </TableBody>
 * </Table>
 */
export const Table: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="shadow-card w-full overflow-x-auto rounded-md bg-white">
      <table className="w-full text-center border-collapse">{children}</table>
    </div>
  );
};

/**
 * Subcomponente de Table para renderizar el encabezado de la tabla.
 */
export const TableHeader: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <thead className="bg-dark-4 border-b border-light-2">{children}</thead>
  );
};

/**
 * Subcomponente de Table para renderizar el cuerpo de la tabla.
 * Aplica un estilo de división entre filas.
 */
export const TableBody: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <tbody className="divide-y divide-light-2">{children}</tbody>;
};

/**
 * Subcomponente de Table para renderizar una fila de la tabla.
 * Incluye un efecto hover para mejorar la interactividad visual.
 */
export const TableRow: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <tr className="hover:bg-light-4 transition-colors">{children}</tr>;
};

/**
 * Subcomponente de Table para renderizar un encabezado de columna.
 */
export const TableHead: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <th className="px-4 py-3 heading-5 tracking-wider">{children}</th>;
};

/**
 * Subcomponente de Table para renderizar una celda de datos.
 */
export const TableCell: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <td className="px-4 py-3 label-normal text-dark-1">{children}</td>;
};
