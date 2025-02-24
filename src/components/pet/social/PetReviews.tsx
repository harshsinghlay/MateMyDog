import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useDebounce } from '../../../hooks/useDebounce';
import { AddReview } from './AddReview';
import type { Pet, Review } from '../../../types/pet';

interface PetReviewsProps {
  pet: Pet;
  onReview: (rating: number, comment: string) => void;
}

export function PetReviews({ pet, onReview }: PetReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [optimisticReviews, setOptimisticReviews] = useState(pet.reviews);
  const [error, setError] = useState<string | null>(null);

  const { execute: debouncedReview } = useDebounce(onReview, {
    delay: 500,
    onError: (error) => {
      setError(error.message);
      setOptimisticReviews(pet.reviews);
    }
  });

  const handleAddReview = async (rating: number, comment: string) => {
    if (!user) return;

    const newReview: Review = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: pet.ownerName || 'Anonymous',
      rating,
      comment,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    setOptimisticReviews(prev => [...prev, newReview]);
    setError(null);

    try {
      await debouncedReview(rating, comment);
      setIsAddingReview(false);
    } catch {
      // Error handling is done in onError callback
    }
  };

  const averageRating = optimisticReviews.reduce((acc, review) => acc + review.rating, 0) / optimisticReviews.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium text-gray-900">Reviews</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">({optimisticReviews.length})</span>
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setIsAddingReview(true)}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Write a review
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="space-y-4">
        {optimisticReviews.map((review) => (
          <div key={review.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{review.userName}</p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>

      {isAddingReview && (
        <AddReview 
          onSave={handleAddReview} 
          onCancel={() => setIsAddingReview(false)} 
        />
      )}
    </div>
  );
}