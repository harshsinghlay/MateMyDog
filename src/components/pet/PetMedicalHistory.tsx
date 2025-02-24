import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AddMedicalRecord } from './medical/AddMedicalRecord';
import type { MedicalRecord } from '../../types/pet';

interface PetMedicalHistoryProps {
  records: MedicalRecord[];
  onAddRecord?: (record: MedicalRecord) => void;
}

export function PetMedicalHistory({ records, onAddRecord }: PetMedicalHistoryProps) {
  const [isAddingRecord, setIsAddingRecord] = useState(false);

  const handleSave = async (record: MedicalRecord) => {
    if (!onAddRecord) return;
  
    try {
      await onAddRecord(record); // Wait for the record to be added
      setIsAddingRecord(false); // Close modal only after successful save
    } catch (error) {
      console.error("Error saving medical record:", error);
      // Optionally, show an error message
    }
  };
  

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Medical History</h2>
          <button 
            onClick={() => setIsAddingRecord(true)}
            className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Record</span>
          </button>
        </div>
        <div className="mt-6 flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {records.map((record) => (
              <li key={record.id} className="py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{record.condition}</p>
                    <p className="text-sm text-gray-500">{record.treatment}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{record.date}</p>
                    <p className="text-sm text-gray-500">Dr. {record.veterinarian}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isAddingRecord && (
        <AddMedicalRecord
          onClose={() => setIsAddingRecord(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}