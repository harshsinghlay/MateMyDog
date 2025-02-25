import { Heart } from "lucide-react";
import type { Pet } from "../../../types/pet";

interface PetLikesProps {
  pet: Pet;
  likesCount: number;
}

export function PetLikes({ likesCount }: PetLikesProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium text-gray-900">Likes</h3>
      <div className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
        <Heart className={`h-4 w-4 `} />
        <span className="text-sm text-gray-500">
          {likesCount} {likesCount <= 1 ? "like" : "likes"}
        </span>
      </div>
    </div>
  );
}
