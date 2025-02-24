import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { AddVaccination } from './vaccinations/AddVaccination';
import type { Vaccination } from '../../types/pet';

interface PetVaccinationsProps {
  vaccinations: Vaccination[];
  onAddVaccination?: (vaccination: Vaccination) => void;
}

export function PetVaccinations({ vaccinations, onAddVaccination }: PetVaccinationsProps) {
  const [isAddingVaccination, setIsAddingVaccination] = useState(false);

  const handleSave = async (vaccination: Vaccination) => {
    if (!onAddVaccination) return;
  
    try {
      await onAddVaccination(vaccination); // Wait for save to complete
      setIsAddingVaccination(false); // Close modal only after successful save
    } catch (error) {
      console.error("Error saving vaccination record:", error);
      // Optionally, show an error message
    }
  };
  

  // Check for upcoming vaccinations (due within 30 days)
  const isUpcoming = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Vaccinations</h2>
          <button 
            onClick={() => setIsAddingVaccination(true)}
            className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Vaccination</span>
          </button>
        </div>
        <div className="mt-6 flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {vaccinations.map((vaccination) => (
              <li key={vaccination.id} className="py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{vaccination.name}</p>
                      {isUpcoming(vaccination.nextDueDate) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Due Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Given on {vaccination.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">Next due: {vaccination.nextDueDate}</p>
                    <p className="text-sm text-gray-500">By {vaccination.administrator}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isAddingVaccination && (
        <AddVaccination
          onClose={() => setIsAddingVaccination(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}