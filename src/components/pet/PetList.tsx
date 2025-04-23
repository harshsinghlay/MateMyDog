import { useState } from "react";
import { toast } from "react-hot-toast";
import { PetCard } from "./PetCard";
import { AddPetCard } from "./AddPetCard";
import { PetListSkeleton } from "./PetListSkeleton";
import { useAuth } from "../../context/AuthContext";
import { petService } from "../../lib/supabase/services";
import { usePets } from "../../hooks/usePets";
import { EditPetProfile } from "./edit/EditPetProfile";
import type { Pet } from "../../types/pet";

export function PetList() {
  const { pets, loading, refetch } = usePets();
  const { isAuthenticated, user } = useAuth();
  const [isAddingPet, setIsAddingPet] = useState(false);

  const handleAddPet = () => {
    if (!isAuthenticated) {
      toast("Please sign in to add a pet", {
        icon: "🔒",
      });
      return;
    }
    setIsAddingPet(true);
  };

  const handleSavePet = async (pet: Pet) => {

    
    try {
      if (!user) {
        toast.error("You must be logged in to add a pet");
        return;
      }

      const newPet = {
        ...pet,
      };


      await petService.addPet(newPet);
      setIsAddingPet(false);
      toast.success("Pet added successfully!");
      refetch();
    } catch (error) {
      console.error("Error adding pet:", error);
      toast.error("Failed to add pet");
    }
  };

  return (
    <div>
      {loading ? (
        <PetListSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
          <AddPetCard onClick={handleAddPet} />
        </div>
      )}

      {isAddingPet && (
        <EditPetProfile
          isNewPet={true}
          onClose={() => setIsAddingPet(false)}
          onSave={handleSavePet}
        />
      )}
    </div>
  );
}
