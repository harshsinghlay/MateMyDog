import React, { useState, useEffect, useCallback, memo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { PetLikes } from './PetLikes';
import { PetReviews } from './PetReviews';
import { PetComments } from './PetComments';
import { CommentsModal } from '../../social/CommentsModal';
import { socialService } from '../../../lib/supabase/services/socialService';
import { useDebounce } from '../../../hooks/useDebounce';
import type { Pet } from '../../../types/pet';
import type { SocialPost } from '../../../types/social';

interface PetSocialProps {
  pet: Pet;
  onLike: () => Promise<void>;
  onReview: (rating: number, comment: string) => Promise<void>;
  onComment: (content: string) => Promise<void>;
}

export const PetSocial = memo(function PetSocial({ 
  pet, 
  onReview, 
  onComment 
}: PetSocialProps) {
  const { isAuthenticated } = useAuth();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [petPost, setPetPost] = useState<SocialPost | null>(null);

  useEffect(() => {
    const loadPetPost = async () => {
      try {
        setLoading(true);
        const posts = await socialService.getPetPosts(pet.id);
        if (posts.length > 0) {
          setPetPost(posts[0]);
        }
      } catch (error) {
        console.error('Error loading pet posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPetPost();
  }, [pet.id]);

  const { execute: debouncedLike } = useDebounce(async () => {
    if (!petPost) return;
    try {
      const response = await socialService.likePost(petPost.id);
      // Update local state based on actual response
      setPetPost(prev => prev ? {
        ...prev,
        isLiked: response,
        likesCount: response ? prev.likesCount + 1 : prev.likesCount - 1
      } : null);
    } catch (error) {
      console.error('Error liking post:', error);
      throw error; // Propagate error to trigger onError in PetLikes
    }
  }, { delay: 500 });

  const handleLike = useCallback(async () => {
    if (!petPost) return;
    await debouncedLike();
  }, [petPost, debouncedLike]);

  const handleComment = useCallback(async (content: string) => {
    if (!petPost) return;

    try {
      await onComment(content);
      setPetPost(prev => prev ? {
        ...prev,
        commentsCount: prev.commentsCount + 1
      } : null);
    } catch (error) {
      console.error('Error commenting:', error);
    }
  }, [petPost, onComment]);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Social
          </button>
        </nav>
      </div>

      <div className="p-6 space-y-8">
        <PetLikes 
          pet={pet} 
          onLike={handleLike}
          likesCount={petPost?.likesCount || 0}
          isLiked={petPost?.isLiked || false}
          loading={loading}
        />
        <PetReviews pet={pet} onReview={onReview} />
        <PetComments 
          pet={pet} 
          onComment={handleComment}
          commentsCount={petPost?.commentsCount || 0}
          onShowComments={() => petPost && setSelectedPostId(petPost.id)}
        />

        {!isAuthenticated && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Please sign in to like, review, or comment on this profile
            </p>
          </div>
        )}
      </div>

      {selectedPostId && (
        <CommentsModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
          onCommentAdded={handleComment}
        />
      )}
    </div>
  );
});