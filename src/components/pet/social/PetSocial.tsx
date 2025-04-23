import React, { useState, useEffect, useCallback, memo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { PetLikes } from "./PetLikes";
import { PetComments } from "./PetComments";
import { CommentsModal } from "../../social/CommentsModal";
import { socialService } from "../../../lib/supabase/services/socialService";
import type { Pet } from "../../../types/pet";
import type { SocialPost } from "../../../types/social";

interface PetSocialProps {
  pet: Pet;
  // onLike: () => Promise<void>;
  // onReview: (rating: number, comment: string) => Promise<void>;
  // onComment: (content: string) => Promise<void>;
}

export const PetSocial = memo(function PetSocial({
  pet,
  // onComment,
}: PetSocialProps) {
  const { isAuthenticated } = useAuth();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [, setLoading] = useState(true);
  const [petPosts, setPetPosts] = useState<SocialPost[]>([]);
  const [totalLikesCount, setTotalLikesCount] = useState(0);
  const [totalCommentsCount, setTotalCommentsCount] = useState(0);

  // Fetch pet posts
  useEffect(() => {
    const loadPetPosts = async () => {
      try {
        setLoading(true);
        const posts = await socialService.getPetPosts(pet.id);
        setPetPosts(posts);
      } catch (error) {
        console.error("Error loading pet posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPetPosts();
  }, [pet.id]);

  useEffect(() => {
    if (petPosts.length) {
      setTotalLikesCount(
        petPosts.reduce((acc, post) => acc + post.likesCount, 0)
      );
      setTotalCommentsCount(
        petPosts.reduce((acc, post) => acc + post.commentsCount, 0)
      );
    }
  }, [petPosts]);

  // const handleComment = useCallback(
  //   async (content: string) => {
  //     if (!petPosts.length) return;
  //     try {
  //       await onComment(content);
  //       setPetPosts((prev) =>
  //         prev.map((post) => ({
  //           ...post,
  //           commentsCount: post.commentsCount + 1,
  //         }))
  //       );
  //     } catch (error) {
  //       console.error("Error commenting:", error);
  //     }
  //   },
  //   [petPosts, onComment]
  // );

  return (
    <div className="bg-white rounded-lg shadow-sm">
     

      <div className="p-6 space-y-8">
        <PetLikes pet={pet} likesCount={totalLikesCount} />

        <PetComments pet={pet} commentsCount={totalCommentsCount} />

        {!isAuthenticated && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Please sign in to like, review, or comment on this profile
            </p>
          </div>
        )}
      </div>

      {/* {selectedPostId && (
        <CommentsModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
          onCommentAdded={handleComment}
        />
      )} */}
    </div>
  );
});
