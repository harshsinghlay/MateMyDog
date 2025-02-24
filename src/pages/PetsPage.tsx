import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { PetList } from '../components/pet/PetList';
import { EditPetProfile } from '../components/pet/edit/EditPetProfile';
import { petService } from '../lib/supabase/services';
import type { Pet } from '../types/pet';

export function PetsPage() {
  const { user } = useAuth();
  const [isAddingPet, setIsAddingPet] = useState(false);

  const handleSavePet = async (pet: Pet) => {
    try {
      if (!user) {
        toast.error('You must be logged in to add a pet');
        return;
      }
      
      const newPet = {
        ...pet,
        ownerId: user.id,
      };

      console.log('New pet data:', newPet); // Debug log
      
      await petService.addPet(newPet);
      setIsAddingPet(false);
      toast.success('Pet added successfully!');
    } catch (error) {
      console.error('Error adding pet:', error);
      toast.error('Failed to add pet');
    }
  };

  return (
    <div>
      {/* <ProductGrid /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-serif font-semibold mb-8">Your Pets</h2>
        <PetList  />
      </div>

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