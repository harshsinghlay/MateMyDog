import React, { useState } from 'react';
import { Input } from '../../ui/Input';
import type { Vaccination } from '../../../types/pet';

interface VaccinationFormProps {
  onSave: (vaccination: Vaccination) => Promise<void>;
  onCancel: () => void;
}

const commonVaccines = [
  'Rabies',
  'DHPP (Distemper, Hepatitis, Parainfluenza, Parvovirus)',
  'Bordetella',
  'Leptospirosis',
  'Lyme Disease',
  'Canine Influenza'
];

export function VaccinationForm({ onSave, onCancel }: VaccinationFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  
  const [formData, setFormData] = useState({
    name: '',
    date: today,
    nextDueDate: nextYear.toISOString().split('T')[0], // Ensure we always have a default next due date
    administrator: '',
    batchNumber: '',
    manufacturer: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate required fields
    if (!formData.name || !formData.date || !formData.nextDueDate || !formData.administrator) {
      return;
    }

    // Ensure nextDueDate is not before the vaccination date
    if (new Date(formData.nextDueDate) < new Date(formData.date)) {
      alert('Next due date cannot be before the vaccination date');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        id: crypto.randomUUID(),
        name: formData.name,
        date: formData.date,
        nextDueDate: formData.nextDueDate, // This will never be null now
        administrator: formData.administrator,
        batchNumber: formData.batchNumber || undefined,
        manufacturer: formData.manufacturer || undefined
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const nextDueDate = new Date(selectedDate);
    nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
    
    setFormData(prev => ({
      ...prev,
      date: e.target.value,
      nextDueDate: nextDueDate.toISOString().split('T')[0]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vaccine Name
        </label>
        <select
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          disabled={isSubmitting}
        >
          <option value="">Select a vaccine</option>
          {commonVaccines.map(vaccine => (
            <option key={vaccine} value={vaccine}>{vaccine}</option>
          ))}
        </select>
      </div>

      <Input
        label="Date Administered"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleDateChange}
        min="2000-01-01"
        max={today}
        disabled={isSubmitting}
        required
      />

      <Input
        label="Next Due Date"
        type="date"
        name="nextDueDate"
        value={formData.nextDueDate}
        onChange={handleChange}
        min={formData.date} // Prevent selecting a date before the vaccination date
        disabled={isSubmitting}
        required
      />

      <Input
        label="Administrator"
        name="administrator"
        value={formData.administrator}
        onChange={handleChange}
        placeholder="Dr. Name"
        disabled={isSubmitting}
        required
      />

      <Input
        label="Batch Number"
        name="batchNumber"
        value={formData.batchNumber}
        onChange={handleChange}
        placeholder="Enter vaccine batch number"
        disabled={isSubmitting}
      />

      <Input
        label="Manufacturer"
        name="manufacturer"
        value={formData.manufacturer}
        onChange={handleChange}
        placeholder="Enter vaccine manufacturer"
        disabled={isSubmitting}
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
          {isSubmitting ? 'Saving...' : 'Save Vaccination'}
        </button>
      </div>
    </form>
  );
}