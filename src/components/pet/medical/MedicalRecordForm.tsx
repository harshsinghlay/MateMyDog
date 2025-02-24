import React, { useState } from "react";
import { Input } from "../../ui/Input";
import { TextArea } from "../../ui/TextArea";
import type { MedicalRecord } from "../../../types/pet";

interface MedicalRecordFormProps {
  onSave: (record: MedicalRecord) => Promise<void>;
  onCancel: () => void;
}

export function MedicalRecordForm({
  onSave,
  onCancel,
}: MedicalRecordFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    condition: "",
    treatment: "",
    veterinarian: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSave({
        id: crypto.randomUUID(),
        ...formData,
      });
    } catch (error) {
      console.error("Error saving medical record:", error);
    } finally {
      setIsSubmitting(false); // Only reset when it's safe
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Date"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        disabled={isSubmitting}
        required
      />

      <Input
        label="Condition/Reason"
        name="condition"
        value={formData.condition}
        onChange={handleChange}
        disabled={isSubmitting}
        placeholder="e.g., Annual Check-up, Vaccination, Injury"
        required
      />

      <TextArea
        label="Treatment Details"
        name="treatment"
        value={formData.treatment}
        onChange={handleChange}
        disabled={isSubmitting}
        placeholder="Describe the treatment provided..."
        required
      />

      <Input
        label="Veterinarian"
        name="veterinarian"
        value={formData.veterinarian}
        onChange={handleChange}
        disabled={isSubmitting}
        placeholder="Dr. Name"
        required
      />

      <TextArea
        label="Additional Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        disabled={isSubmitting}
        placeholder="Any additional notes or observations..."
      />

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Record"}
        </button>
      </div>
    </form>
  );
}
