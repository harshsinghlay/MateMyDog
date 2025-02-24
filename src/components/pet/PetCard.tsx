import React from "react";
import { useNavigate } from "react-router-dom";
import type { Pet } from "../../types/pet";

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/pets/${pet.id}`)}
      className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <img
          src={pet.imageUrl}
          alt={pet.name}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {pet.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{pet.breed}</p>
        </div>
      </div>
    </div>
  );
}
