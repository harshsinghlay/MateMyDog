import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { PetFeedItem } from "../components/social/PetFeedItem";
import { AuthModal } from "../components/auth/AuthModal";
import type { SocialPost } from "../types/social";
import { useSocialPosts } from "../hooks/useSocialPosts";

export function SharedPostPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<SocialPost | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const {
    posts,
    loading,
    refresh: loadPosts,
    likePost,
    commentPost,
  } = useSocialPosts();
  const [likeInProgress, setLikeInProgress] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    if (!id) return;
    if (posts.length > 0) {
      const sharedPost = posts.find((p) => String(p.id) === id);
      setPost(sharedPost || null);
    }
  }, [posts]);

  // Ensure posts are loaded when visiting the page
  useEffect(() => {
    loadPosts();
  }, []);

  const handleLike = useCallback(
    async (postId: string) => {
      if (!isAuthenticated) {
        toast("Please sign in to like posts", { icon: "🔒" });
        setShowAuthModal(true);
        return;
      }
      if (likeInProgress[postId]) return;
      setLikeInProgress((prev) => ({ ...prev, [postId]: true }));
      await likePost(postId);
      setLikeInProgress((prev) => ({ ...prev, [postId]: false }));
    },
    [isAuthenticated, likePost, likeInProgress]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">
          Post Not Found
        </h2>
        <p className="text-gray-500">
          This post may have been removed or is no longer available.
        </p>
      </div>
    );
  }

  return (
    <div >
      <div className="w-full">
        <PetFeedItem
          post={post}
          onLike={handleLike}
          onComment={commentPost}
          isActive={true}
        />
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
