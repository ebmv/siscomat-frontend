import React from 'react';

interface TestCardProps {
  title: string;
  description: string;
}

export const TestCard = ({ title, description }: TestCardProps) => {
  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
        {title}
      </h2>
      <p className="text-base font-normal text-gray-600">
        {description}
      </p>
    </div>
  );
};