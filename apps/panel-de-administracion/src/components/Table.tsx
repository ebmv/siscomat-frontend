import type { FC } from "react";
import React from "react";

export const Table: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="shadow-card w-full overflow-x-auto rounded-md bg-white">
      <table className="w-full text-center border-collapse">{children}</table>
    </div>
  );
};

export const TableHeader: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <thead className="bg-dark-4 border-b border-light-2">{children}</thead>
  );
};

export const TableBody: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <tbody className="divide-y divide-light-2">{children}</tbody>;
};

export const TableRow: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <tr className="hover:bg-light-4 transition-colors">{children}</tr>;
};

export const TableHead: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <th className="px-4 py-3 heading-5 tracking-wider">{children}</th>;
};

export const TableCell: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <td className="px-4 py-3 label-normal text-dark-1">{children}</td>;
};
