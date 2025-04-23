import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { PetHeader } from "../components/pet/PetHeader";
import { PetDetails } from "../components/pet/PetDetails";
import { PetMedicalHistory } from "../components/pet/PetMedicalHistory";
import { PetVaccinations } from "../components/pet/PetVaccinations";
import { PetSocial } from "../components/pet/social/PetSocial";
import { EditPetProfile } from "../components/pet/edit/EditPetProfile";
import { SharePetProfile } from "../components/pet/share/SharePetProfile";
import { petService } from "../lib/supabase/services";
import type { Pet, MedicalRecord, Vaccination } from "../types/pet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { PetMatchmaking } from "../components/pet/matchmaking/PetMatchmaking";

export function PetProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);


  const isOwner = user?.id === pet?.owner.id;

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const petData = await petService.getPet(id);
        console.log("Pet is",petData);
        
        setPet(petData);
      } catch (err) {
        console.error("Error fetching pet:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch pet"));
        toast.error("Failed to load pet details");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleUpdatePet = async (updatedPet: Pet) => {
    if (!id) return;
    try {
      const saved = await petService.updatePet(id, updatedPet);
      setPet(saved);
      setIsEditing(false);
      toast.success("Pet Updated successfully");
    } catch (err) {
      console.error("Error updating pet:", err);
      toast.error("Failed to update pet profile");
    }
  };


  // const handleLike = async () => {
  //   if (!id || !user) {
  //     toast.error("You must be logged in to like a pet");
  //     return;
  //   }
  //   try {
  //     const updatedPet = await petService.likePet(
  //       id,
  //       user.id,
  //       user.fullName || "Anonymous"
  //     );
  //     setPet(updatedPet);
  //   } catch (err) {
  //     console.error("Error liking pet:", err);
  //     toast.error("Failed to like pet");
  //   }
  // };

  // const handleReview = async (rating: number, comment: string) => {
     
  // };

  // const handleComment = async (content: string) => {
  //   if (!id || !user) {
  //     toast.error("You must be logged in to comment");
  //     return;
  //   }
  //   try {
  //     const updatedPet = await petService.postComment(
  //       id,
  //       user.id,
  //       user.fullName || "Anonymous",
  //       content
  //     );
  //     setPet(updatedPet);
  //     toast.success("Comment added successfully");
  //   } catch (err) {
  //     console.error("Error posting comment:", err);
  //     toast.error("Failed to add comment");
  //   }
  // };

  const handleAddMedicalRecord = async (record: Omit<MedicalRecord, "id">) => {
    if (!id) return;
    try {
      const updatedPet = await petService.addMedicalRecord(id, record);
      setPet(updatedPet);
      toast.success("Medical record added successfully");
    } catch (err) {
      console.error("Error adding medical record:", err);
      toast.error("Failed to add medical record");
    }
  };

  const handleAddVaccination = async (vaccination: Omit<Vaccination, "id">) => {
    if (!id) return;
    try {
      const updatedPet = await petService.addVaccination(id, vaccination);
      setPet(updatedPet);
      toast.success("Vaccination record added successfully");
    } catch (err) {
      console.error("Error adding vaccination:", err);
      toast.error("Failed to add vaccination");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center  ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="flex flex-col items-center justify-center ">
        <p className="text-red-600 mb-4">{error?.message || "Pet not found"}</p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return (
    <div className="pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <PetHeader
          pet={pet}
          isOwner={isOwner}
          onEdit={() => setIsEditing(true)}
          onShare={() => setIsSharing(true)}
        />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PetDetails pet={pet} />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <Tabs defaultValue="social" className="w-full">
                <TabsList className="w-full border-b">
                  <TabsTrigger value="social" className="flex-1">
                    Social
                  </TabsTrigger>
                  <TabsTrigger value="matchmaking" className="flex-1">
                    Matchmaking
                  </TabsTrigger>
                  <TabsTrigger value="wellbeing" className="flex-1">
                    Wellbeing
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="social" className="p-6">
                  <PetSocial
                    pet={pet}
                    // onLike={handleLike}
                    // onReview={handleReview}
                    // onComment={handleComment}
                  />
                </TabsContent>

                <TabsContent value="matchmaking" className="p-6">
                  <PetMatchmaking
                    pet={pet}
                    onUpdate={handleUpdatePet}
                    isOwner={isOwner}
                  />
                </TabsContent>

                <TabsContent value="wellbeing" className="p-6 space-y-6">
                  <PetMedicalHistory
                    records={pet.medicalHistory}
                    onAddRecord={handleAddMedicalRecord}
                  />
                  <PetVaccinations
                    vaccinations={pet.vaccinations}
                    onAddVaccination={handleAddVaccination}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {isEditing && (
          <EditPetProfile
            pet={pet}
            onClose={() => setIsEditing(false)}
            onSave={handleUpdatePet}
          />
        )}

        {isSharing && (
          <SharePetProfile pet={pet} onClose={() => setIsSharing(false)} />
        )}

        {/* {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Pet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete {pet.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePet}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )} */}
      </div>
    </div>
  );
}
