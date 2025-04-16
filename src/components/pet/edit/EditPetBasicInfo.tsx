import { useEffect, useState } from "react";
import type { Pet } from "../../../types/pet";
import { mockPets } from "../../../utils/mockPets";

interface EditPetBasicInfoProps {
  pet: Pet;
  onChange: (field: keyof Pet, value: unknown) => void;
  breeds: string[];
}

const breeds = [...new Set(mockPets.map((pet) => pet.breed))];

export function EditPetBasicInfo({ pet, onChange }: EditPetBasicInfoProps) {
  const [age, setAge] = useState<number>(pet.age || 0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const calculateAge = (dob: string | null): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    if (birthDate > today) return 0;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return Math.max(0, age);
  };

  useEffect(() => {
    if (pet.dateOfBirth) {
      const newAge = calculateAge(pet.dateOfBirth);
      setAge(newAge);
      onChange("age", newAge);
    }
  }, [pet.dateOfBirth]);

  const today = new Date();
  const lastYearDate = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  );
  const maxDate = lastYearDate.toISOString().split("T")[0];

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
          required
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          value={pet.owner.fullName}
          required
          disabled
          // onChange={(e) => handleInputChange("ownerName", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          required
          onChange={(e) => onChange("breed", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          required
          onChange={(e) =>
            onChange("gender", e.target.value as "male" | "female")
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          required
          max={maxDate}
          onChange={(e) => {
            const selectedDate = e.target.value;
            const newAge = calculateAge(selectedDate);
            onChange("dateOfBirth", selectedDate);
            setAge(newAge);
            onChange("age", newAge);
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.dateOfBirth && (
          <p className="text-red-500 text-xs">{errors.dateOfBirth}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-gray-700"
        >
          Age (years) *
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={age}
          readOnly
          className="mt-1 block w-full bg-gray-200 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-not-allowed"
        />
        {errors.age && <p className="text-red-500 text-xs">{errors.age}</p>}
      </div>
    </div>
  );
}
