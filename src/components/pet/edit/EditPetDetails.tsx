import type { Pet } from "../../../types/pet";
import MultiSelectDropdown from "../../ui/MultiSelectDropdown";
import { useState } from "react";

interface EditPetDetailsProps {
  pet: Pet;
  onChange: (field: keyof Pet, value: unknown) => void;
}

const temperamentOptions = [
  { id: "friendly", name: "Friendly" },
  { id: "playful", name: "Playful" },
  { id: "calm", name: "Calm" },
  { id: "energetic", name: "Energetic" },
  { id: "social", name: "Social" },
  { id: "independent", name: "Independent" },
  { id: "gentle", name: "Gentle" },
  { id: "protective", name: "Protective" },
  { id: "intelligent", name: "Intelligent" },
  { id: "affectionate", name: "Affectionate" },
];

export function EditPetDetails({ pet, onChange }: EditPetDetailsProps) {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.weight && (
            <p className="text-red-500 text-xs">{errors.weight}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="microchipId"
            className="block text-sm font-medium text-gray-700"
          >
            Microchip ID
          </label>
          <input
            type="text"
            id="microchipId"
            name="microchipId"
            value={pet.microchipId || ""}
            maxLength={30}
            onChange={(e) => onChange("microchipId", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* MultiSelectDropdown for Temperaments */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Temperament
          </label>
          <MultiSelectDropdown
            options={temperamentOptions}
            defaultSelected={
              pet.temperament?.map((temp: string) => ({
                id: temp.toLowerCase(),
                name: temp,
              })) || []
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(selected: any[]) =>
              onChange(
                "temperament",
                selected.map((item) => item.name)
              )
            }
          />
        </div>
      </div>
 
    </div>
  );
}
