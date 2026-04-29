import React from "react";

interface TestCardProps {
  title: string;
  description: string;
}

export const TestCard = ({ title, description }: TestCardProps) => {
  return (
    <div className="max-w-sm p-6 bg-light-4 border border-light-2 rounded-lg shadow-sm">
      <h2 className="mb-2 heading-5 tracking-tight text-brand-primary">
        {title}
      </h2>
      <p className="body-normal text-dark-2">{description}</p>
    </div>
  );
};
