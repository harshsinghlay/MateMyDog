/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const POSTS_PER_PAGE = 10; // Number of posts per request

  const loadPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const offset = (pageNum - 1) * POSTS_PER_PAGE;
      const limit = POSTS_PER_PAGE;

      // Pass all three expected arguments
      const data = await socialService.getPosts(pageNum, POSTS_PER_PAGE, {
        offset,
        limit,
      });

      setPosts((prev) => (pageNum === 1 ? data : [...prev, ...data])); // Append new posts
      setHasMore(data.length === POSTS_PER_PAGE); // If less than 10, no more data
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

  const loadMorePosts = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
      loadPosts(page + 1);
    }
  };

  // Debounced like API call
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

      if (currentTime - lastLikeTime < 500) {
        return; // Ignore rapid clicks
      }

      try {
        setLikeQueue((prev) => ({ ...prev, [postId]: currentTime }));

        const originalState = {
          likesCount: post.likesCount,
          isLiked: post.isLiked,
        };

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
                  isLiked: !p.isLiked,
                }
              : p
          )
        );

        const isLiked = (await debouncedLikePost(postId)) as boolean;

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likesCount: isLiked
                    ? originalState.likesCount + 1
                    : Math.max(0, originalState.likesCount - 1),
                  isLiked,
                }
              : p
          )
        );

        setLikeQueue((prev) => {
          const newQueue = { ...prev };
          delete newQueue[postId];
          return newQueue;
        });
      } catch (error) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likesCount: Math.max(0, post.likesCount),
                  isLiked: post.isLiked,
                }
              : p
          )
        );

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
    async (postId: string) => {
      if (!isAuthenticated) return;
      try {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
          )
        );

        // await socialService.addComment(postId, content);
      } catch (error) {
        console.error("Error commenting on post:", error);
        toast.error("Failed to add comment");
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) }
              : p
          )
        );
      }
    },
    [isAuthenticated, posts]
  );

  return {
    posts,
    loading,
    error,
    refresh: () => loadPosts(1),
    likePost,
    commentPost,
    loadMorePosts,
    hasMore,
  };
}
