import React from 'react';
import { Plus } from 'lucide-react';

interface AddPetCardProps {
  onClick: () => void;
}

export function AddPetCard({ onClick }: AddPetCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
    >
      <Plus className="h-8 w-8 text-gray-400" />
      <span className="mt-2 text-sm font-medium text-gray-500">Add New Pet</span>
    </button>
  );
}