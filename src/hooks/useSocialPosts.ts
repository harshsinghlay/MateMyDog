import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { socialService } from "../lib/supabase/services/socialService";
import { useDebounce } from "./useDebounce";
import type { SocialPost } from "../types/social";

export function useSocialPosts() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [likeQueue, setLikeQueue] = useState<Record<string, number>>({});

  const loadPosts = async () => {
    // if (!isAuthenticated) {
    //   setPosts([]);
    //   setLoading(false);
    //   return;
    // }

    try {
      setLoading(true);
      setError(null);
      const data = await socialService.getPosts();
      setPosts(data);
    } catch (err) {
      console.error("Error loading posts:", err);
      setError(err instanceof Error ? err : new Error("Failed to load posts"));
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [isAuthenticated]);

  // Create a debounced version of the like API call
  const { execute: debouncedLikePost } = useDebounce(
    async (postId: string): Promise<boolean> => {
      const result = await socialService.likePost(postId);
      return !!result; // Ensure it's a boolean
    },
    {
      delay: 500,
      onError: (error) => {
        console.error("Error liking post:", error);
        toast.error("Failed to like post");
      },
    }
  );

  const likePost = useCallback(
    async (postId: string) => {
      if (!isAuthenticated) return;

      const currentTime = Date.now();
      const lastLikeTime = likeQueue[postId] || 0;
      const post = posts.find((p) => p.id === postId);

      if (!post) return;

      // Check if enough time has passed since the last like
      if (currentTime - lastLikeTime < 500) {
        return; // Ignore rapid clicks
      }

      try {
        // Update like queue
        setLikeQueue((prev) => ({ ...prev, [postId]: currentTime }));

        // Store the current state for potential rollback
        const originalState = {
          likesCount: post.likesCount,
          isLiked: post.isLiked,
        };

        // Optimistically update UI
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              const newLikesCount = p.isLiked
                ? Math.max(0, p.likesCount - 1)
                : p.likesCount + 1;
              return {
                ...p,
                likesCount: newLikesCount,
                isLiked: !p.isLiked,
              };
            }
            return p;
          })
        );

        // Make debounced API call
        const isLiked = (await debouncedLikePost(postId)) as boolean;

        // Update UI based on actual result if needed
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              // Ensure likes count never goes below 0
              const newLikesCount = isLiked
                ? originalState.likesCount + 1
                : Math.max(0, originalState.likesCount - 1);
              return {
                ...p,
                likesCount: newLikesCount,
                isLiked: isLiked,
              };
            }
            return p;
          })
        );

        // Clear from queue after successful update
        setLikeQueue((prev) => {
          const newQueue = { ...prev };
          delete newQueue[postId];
          return newQueue;
        });
      } catch (error) {
        // Revert to original state on error
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                likesCount: Math.max(0, post.likesCount),
                isLiked: post.isLiked,
              };
            }
            return p;
          })
        );

        // Clear from queue
        setLikeQueue((prev) => {
          const newQueue = { ...prev };
          delete newQueue[postId];
          return newQueue;
        });
      }
    },
    [posts, isAuthenticated, likeQueue]
  );

  const commentPost = useCallback(
    async (postId: string, content: string) => {
      if (!isAuthenticated) return;

      try {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              return { ...p, commentsCount: p.commentsCount + 1 };
            }
            return p;
          })
        );

        //   await socialService.addComment(postId, content);
      } catch (error) {
        console.error("Error commenting on post:", error);
        toast.error("Failed to add comment");
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              return { ...p, commentsCount: Math.max(0, p.commentsCount - 1) };
            }
            return p;
          })
        );
      }
    },
    [isAuthenticated, posts]
  );

  return {
    posts,
    loading,
    error,
    refresh: loadPosts,
    likePost,
    commentPost,
  };
}
