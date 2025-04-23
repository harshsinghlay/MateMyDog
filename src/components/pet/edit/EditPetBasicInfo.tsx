import {useState } from "react";
import type { Pet } from "../../../types/pet";
import { mockPets } from "../../../utils/mockPets";
import { useAuth } from "../../../context/AuthContext";

interface EditPetBasicInfoProps {
  pet: Pet;
  onChange: (field: keyof Pet, value: unknown) => void;
  breeds: string[];
}


const breeds = [...new Set(mockPets.map((pet) => pet.breed))];

export function EditPetBasicInfo({ pet, onChange }: EditPetBasicInfoProps) {
  const {user} = useAuth();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleWeightChange = (value: string) => {
    const weight = parseFloat(value);
    if (!value.trim() || weight <= 0) {
      setErrors((prev) => ({
        ...prev,
        weight: "Weight must be greater than 0",
      }));
    } else {
      setErrors((prev) => ({ ...prev, weight: "" }));
    }
    onChange("weight", weight || 0);
  };

  const getYesterdayDate = (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const handleInputChange = (field: keyof Pet, value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: "This field is required" }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    onChange(field, value);
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Pet Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={pet.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-1 px-1"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
      </div>

      <div>
        <label
          htmlFor="ownerName"
          className="block text-sm font-medium text-gray-700"
        >
          Owner Name *
        </label>
        <input
          type="text"
          id="ownerName"
          name="ownerName"
          value={user.fullName}
          disabled
          // onChange={(e) => handleInputChange("ownerName", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-1 px-1"
        />
        {errors.ownerName && (
          <p className="text-red-500 text-xs">{errors.ownerName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="breed"
          className="block text-sm font-medium text-gray-700"
        >
          Breed *
        </label>
        <select
          id="breed"
          name="breed"
          value={pet.breed}
          onChange={(e) => onChange("breed", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-1 px-1"
        >
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
        {errors.breed && <p className="text-red-500 text-xs">{errors.breed}</p>}
      </div>

      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700"
        >
          Gender *
        </label>
        <select
          id="gender"
          name="gender"
          value={pet.gender}
          onChange={(e) =>
            onChange("gender", e.target.value as "male" | "female")
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-1 px-1"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-xs">{errors.gender}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="dateOfBirth"
          className="block text-sm font-medium text-gray-700"
        >
          Date of Birth *
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={pet.dateOfBirth}
          max={getYesterdayDate()}
          onChange={(e) => {
            const selectedDate = e.target.value;
            onChange("dateOfBirth", selectedDate);
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-1 px-1"
        />
        {errors.dateOfBirth && (
          <p className="text-red-500 text-xs">{errors.dateOfBirth}</p>
        )}
      </div>

      <div>
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-gray-700"
          >
            Weight (kg) *
          </label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={pet.weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-1 px-1"
          />
          {errors.weight && (
            <p className="text-red-500 text-xs">{errors.weight}</p>
          )}
        </div>

      {/* <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-gray-700"
        >
          Age (years) *
        </label>
        <input
          type="text"
          id="age"
          name="age"
          value={formatAgeDisplay(age)}
          readOnly
          className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-not-allowed"
        />
        {errors.age && <p className="text-red-500 text-xs">{errors.age}</p>}
      </div> */}
    </div>
  );
}
