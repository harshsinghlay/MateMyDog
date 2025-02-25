import React, { useState, useCallback, memo } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useDebounce } from "../../../hooks/useDebounce";
import type { Pet } from "../../../types/pet";

interface PetLikesProps {
  pet: Pet;
  onLike: () => Promise<void>;
  likesCount: number;
  isLiked: boolean;
  loading: boolean;
}

export const PetLikes = memo(function PetLikes({
  onLike,
  likesCount: initialLikesCount,
  isLiked: initialIsLiked,
  loading,
}: PetLikesProps) {
  const { isAuthenticated } = useAuth();
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(initialIsLiked);
  const [optimisticLikesCount, setOptimisticLikesCount] =
    useState(initialLikesCount);

  // Reset optimistic state when props change
  React.useEffect(() => {
    setOptimisticIsLiked(initialIsLiked);
    setOptimisticLikesCount(initialLikesCount);
  }, [initialIsLiked, initialLikesCount]);

  const { execute: debouncedLike } = useDebounce(onLike, {
    delay: 500,
    onError: () => {
      // Revert optimistic updates on error
      setOptimisticIsLiked(initialIsLiked);
      setOptimisticLikesCount(initialLikesCount);
    },
  });

  const handleLike = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) return;

      // Optimistically update UI
      setOptimisticIsLiked((prev) => !prev);
      setOptimisticLikesCount((prev) => prev + (optimisticIsLiked ? -1 : 1));

      try {
        await debouncedLike();
      } catch (error) {
        console.error("Error liking:", error);
      }
    },
    [isAuthenticated, optimisticIsLiked, debouncedLike]
  );

  // Return empty div while loading instead of shimmer effect
  if (loading) {
    return <div className="h-8" />;
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLike}
        disabled={!isAuthenticated}
        className={`group flex items-center space-x-1 px-3 py-1 rounded-full 
          ${
            optimisticIsLiked
              ? "text-rose-600 bg-rose-50"
              : "text-gray-600 bg-gray-50 hover:bg-gray-100"
          } transition-colors duration-200 disabled:opacity-50`}
      >
        <Heart
          className={`h-4 w-4 ${optimisticIsLiked ? "fill-current" : ""}`}
        />
      </button>
      {optimisticLikesCount > 0 && (
        <span className="text-sm text-gray-500">
          {optimisticLikesCount} {optimisticLikesCount === 1 ? "like" : "likes"}
        </span>
      )}
    </div>
  );
});
