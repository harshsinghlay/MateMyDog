import React from 'react';
import { Cake, Weight, Dna, QrCode, MapPin } from 'lucide-react';
import type { Pet } from '../../types/pet';

interface PetDetailsProps {
  pet: Pet;
}

export function PetDetails({ pet }: PetDetailsProps) {
  const details = [
    { icon: Cake, label: 'Date of Birth', value: pet.dateOfBirth },
    { icon: Weight, label: 'Weight', value: `${pet.weight} kg` },
    { icon: Dna, label: 'Breed', value: pet.breed },
    { icon: QrCode, label: 'Microchip ID', value: pet.microchipId || 'Not available' },
    { 
      icon: MapPin, 
      label: 'Location', 
      value: `${pet.location.city}, ${pet.location.state}, ${pet.location.country}` 
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900">Pet Details</h2>
      <div className="mt-6 space-y-6">
        {details.map((detail) => (
          <div key={detail.label} className="flex items-center space-x-3">
            <detail.icon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">{detail.label}</p>
              <p className="text-sm text-gray-900">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}