import React from 'react';
import { X } from 'lucide-react';
import { VaccinationForm } from './VaccinationForm';
import type { Vaccination } from '../../../types/pet';

interface AddVaccinationProps {
  onClose: () => void;
  onSave: (vaccination: Vaccination) => void;
}

export function AddVaccination({ onClose, onSave }: AddVaccinationProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-semibold">Add Vaccination Record</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <VaccinationForm onSave={onSave} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}