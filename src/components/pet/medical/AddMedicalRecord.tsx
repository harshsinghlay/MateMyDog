import React from "react";
import { X } from "lucide-react";
import { MedicalRecordForm } from "./MedicalRecordForm";
import type { MedicalRecord } from "../../../types/pet";

interface AddMedicalRecordProps {
  onClose: () => void;
  onSave: (record: MedicalRecord) => void;
}

export function AddMedicalRecord({ onClose, onSave }: AddMedicalRecordProps) {
 
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-semibold">
              Add Medical Record
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <MedicalRecordForm onSave={onSave} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
