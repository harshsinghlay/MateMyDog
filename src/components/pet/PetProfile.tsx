import React from "react";
import type { Pet } from "../../types/pet";
import { PetHeader } from "./PetHeader";
import { PetDetails } from "./PetDetails";
import { PetSocial } from "./social/PetSocial";

interface PetProfileProps {
  pet: Pet;
  isOwner: boolean;
}

export function PetProfile({ pet, isOwner }: PetProfileProps) {
  return (
    <div className="space-y-6">
      <PetHeader
        isOwner={isOwner}
        pet={pet}
        onEdit={() => {}}
        onShare={() => {}}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PetDetails pet={pet} />
        </div>
        <div className="lg:col-span-2">
          <PetSocial
            pet={pet}
          />
        </div>
      </div>
    </div>
  );
}
