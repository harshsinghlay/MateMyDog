import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { EditPetBasicInfo } from "./EditPetBasicInfo";
import { EditPetDetails } from "./EditPetDetails";
import { EditPetImage } from "./EditPetImage";
import { mockPets } from "../../../utils/mockPets";
import type { Pet } from "../../../types/pet";
import { useAuth } from "../../../context/AuthContext";

interface EditPetProfileProps {
  pet?: Pet;
  onClose: () => void;
  onSave: (updatedPet: Pet) => void;
  isNewPet?: boolean;
}

const breeds = [...new Set(mockPets.map((pet) => pet.breed))];

export function EditPetProfile({
  pet,
  onClose,
  onSave,
  isNewPet = false,
}: EditPetProfileProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<Pet>({
    name: "",
    breed: breeds[0] || "",
    age: 0,
    gender: "male",
    imageUrl:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ownerId: "",
    ownerName: user?.fullName || "",
    dateOfBirth: "",
    weight: 0,
    location: {
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      country: user?.address?.country || "",
      postalCode: user?.address?.postalCode || "",
    },
    microchipId: "",
    temperament: [],
    medicalHistory: [],
    vaccinations: [],
    media: [],
    likes: [],
    reviews: [],
    comments: [],
    rating: 0,
    ...pet,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const requiredFields: (keyof Pet)[] = [
      "name",
      "breed",
      "age",
      "gender",
      "imageUrl",
      "dateOfBirth",
      "weight",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    if (formData.age < 1) {
      toast.error("Age must be greater than 0");
      return false;
    }

    if (formData.weight < 1) {
      toast.error("Weight must be greater than 1");
      return false;
    }

    const requiredLocationFields: (keyof Pet["location"])[] = [
      "city",
      "state",
      "country",
      "postalCode",
    ];
    const missingLocationFields = requiredLocationFields.filter(
      (field) => !formData.location[field]
    );

    if (missingLocationFields.length > 0) {
      toast.error(
        `Please fill in all location fields: ${missingLocationFields.join(
          ", "
        )}`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
    } catch (error) {
      console.error("Error saving pet:", error);
      toast.error("Failed to save pet");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof Pet, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-semibold">
              {isNewPet ? "Add New Pet" : "Edit Pet Profile"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <EditPetImage pet={formData} onChange={handleInputChange} />
            <EditPetBasicInfo
              pet={formData}
              onChange={handleInputChange}
              breeds={breeds}
            />
            <EditPetDetails pet={formData} onChange={handleInputChange} />

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
