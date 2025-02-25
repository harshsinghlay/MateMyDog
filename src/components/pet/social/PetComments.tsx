import { MessageCircle } from "lucide-react";
import type { Pet } from "../../../types/pet";

interface PetCommentsProps {
  pet: Pet;
  commentsCount: number;
}

export function PetComments({ commentsCount }: PetCommentsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Comments</h3>
        {/* <button
          onClick={onShowComments}
          className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{commentsCount}</span>
        </button> */}
        <div className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
          <MessageCircle className={`h-4 w-4 `} />
          <span className="text-sm text-gray-500">
            {commentsCount} {commentsCount <= 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>
    </div>
  );
}
