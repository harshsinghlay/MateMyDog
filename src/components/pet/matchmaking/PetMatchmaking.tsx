import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import type { Pet } from "../../../types/pet";
import { MapPin } from "lucide-react";
import { Address, User } from "../../../types/user";
import { userService } from "../../../lib/supabase/services/userService";
import { useAuth } from "../../../context/AuthContext";

interface PetMatchmakingProps {
  pet: Pet;
  onUpdate: (updatedPet: Pet) => Promise<void>;
  isOwner: boolean;
}

export function PetMatchmaking({ pet, onUpdate, isOwner }: PetMatchmakingProps) {
  
  const {user,  setUser } = useAuth();
  const [includeInMatchmaking, setIncludeInMatchmaking] = useState(
    pet.matchmaking?.enabled || false
  );
  const [purposes, setPurposes] = useState({
    playdate: pet.matchmaking?.purposes?.includes("playdate") || false,
    breeding: pet.matchmaking?.purposes?.includes("breeding") || false,
    adoption: pet.matchmaking?.purposes?.includes("adoption") || false,
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check if at least one purpose is selected when matchmaking is enabled
  useEffect(() => {
    if (includeInMatchmaking) {
      const hasPurpose = Object.values(purposes).some((enabled) => enabled);
      if (!hasPurpose) {
        toast.error("Please select at least one purpose.");
      }
    }
  }, [includeInMatchmaking]);

  useEffect(()=>{
    console.log("Pet is",pet);
  },[])

  const handleLocationDetection = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
  
    toast.loading("Detecting location...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const apiKey = import.meta.env.VITE_GEOCODE_API_KEY;
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${apiKey}`
          );
  
          if (!response.ok) throw new Error("Failed to fetch location data");
  
          const data = await response.json();
          const { city, state, country, postcode } = data.results[0].components;
          const { lat, lng } = data.results[0].geometry;
  
          const location = { city, state, country, lat, lng, postalCode: postcode };
  
          const newLocation = await userService.updateAddress({id : pet.owner.location.id , ...location});
          
          if (newLocation) {
            setUser({...user, location : newLocation});
          }
  
          toast.success("Location detected successfully");
        } catch (error) {
          console.error("Error detecting location:", error);
          toast.error("Failed to detect location");
        } finally {
          toast.dismiss();
        }
      },
      () => {
        toast.dismiss();
        toast.error("Unable to retrieve your location");
      }
    );
  };
  

  const handleMatchmakingChange = (checked: boolean) => {
    // If enabling matchmaking, check if at least one purpose is selected
    if (checked && !Object.values(purposes).some((enabled) => enabled)) {
      toast.error("Please select at least one purpose.");
      return;
    }

    setIncludeInMatchmaking(checked);
    setHasUnsavedChanges(true);
  };

  const handlePurposeChange = (purpose: keyof typeof purposes) => {
    const newPurposes = {
      ...purposes,
      [purpose]: !purposes[purpose],
    };

    // Check if at least one purpose would remain selected
    if (includeInMatchmaking && !Object.values(newPurposes).some((enabled) => enabled)) {
      toast.error("Please select at least one purpose.");
      return;
    }

    setPurposes(newPurposes);
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      // Validate settings before saving
      if (includeInMatchmaking && !Object.values(purposes).some((enabled) => enabled)) {
        toast.error("Please select at least one purpose.");
        return;
      }

      if(!pet.owner.location?.lat){
          toast.error("Please Update Location");
          return;
      }

      const updatedPet = {
        ...pet,
        matchmaking: {
          ...pet.matchmaking,
          enabled: includeInMatchmaking,
          purposes: Object.entries(purposes)
            .filter(([_, enabled]) => enabled)
            .map(([purpose]) => purpose),
        },
      };

      await onUpdate(updatedPet);
      setHasUnsavedChanges(false);
      if(includeInMatchmaking){
        toast.success("Added In Matchmaking");
      }else{
        toast.success("Removed From Matchmaking");
      }
    } catch (error) {
      console.error("Error saving matchmaking settings:", error);
      toast.error("Failed to save matchmaking settings");
    } finally {
      setSaving(false);
    }
  };

  if (!isOwner) {
    return (
      <div className="text-center py-8 text-gray-500">
        Only the pet owner can manage matchmaking settings.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <div className="flex item-center justify-between">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={includeInMatchmaking}
              onChange={(e) => handleMatchmakingChange(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
            />
            <span className="text-gray-900 font-medium">
              Include in matchmaking
            </span>
          </label>
          {
            !pet.owner.location.lat &&
            <button
              type="button"
              onClick={handleLocationDetection}
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Detect Location
            </button>
          }
        </div>
        <p className="mt-2 text-sm text-gray-500 ml-8">
          Enable this option to make your pet visible in matchmaking searches.
        </p>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Purpose</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={purposes.playdate}
              onChange={() => handlePurposeChange("playdate")}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
            />
            <div>
              <span className="text-gray-900 font-medium">Playdate</span>
              <p className="text-sm text-gray-500">
                Find playmates for your pet
              </p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={purposes.breeding}
              onChange={() => handlePurposeChange("breeding")}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
            />
            <div>
              <span className="text-gray-900 font-medium">Breeding</span>
              <p className="text-sm text-gray-500">
                Connect with breeding partners
              </p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={purposes.adoption}
              onChange={() => handlePurposeChange("adoption")}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
            />
            <div>
              <span className="text-gray-900 font-medium">Adoption</span>
              <p className="text-sm text-gray-500">
                List your pet for adoption
              </p>
            </div>
          </label>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="pt-6 flex justify-end">
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}