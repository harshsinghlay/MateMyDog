import { useState, useRef, useEffect, useCallback } from "react";
import { PetFeedItem } from "./PetFeedItem";
import { useSwipeable } from "react-swipeable";
import { SocialPost } from "../../types/social";

interface PetFeedProps {
  posts: SocialPost[];
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  loadMorePosts: () => void;
  hasMore: boolean;
}

export function PetFeed({
  posts,
  onLike,
  onComment,
  loadMorePosts,
  hasMore,
}: PetFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);
  const prevPostsLength = useRef(posts.length);
  const isLoadingMore = useRef(false);
  const scrollPositionRef = useRef(0);
  const lastScrollHeightRef = useRef(0);

  const scrollToPost = useCallback(
    (index: number) => {
      if (feedRef.current && index >= 0 && index < posts.length) {
        const postElement = feedRef.current.children[index] as HTMLElement;
        postElement.scrollIntoView({ behavior: "smooth" });
        setCurrentIndex(index);
      }
    },
    [posts.length]
  );

  const handlers = useSwipeable({
    onSwipedUp: () => scrollToPost(currentIndex + 1),
    onSwipedDown: () => scrollToPost(currentIndex - 1),
    trackMouse: true,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        scrollToPost(currentIndex - 1);
      } else if (e.key === "ArrowDown") {
        scrollToPost(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, scrollToPost]);

  useEffect(() => {
    if (feedRef.current) {
      scrollPositionRef.current = feedRef.current.scrollTop;
      lastScrollHeightRef.current = feedRef.current.scrollHeight;
    }
  }, [posts]);

  useEffect(() => {
    if (feedRef.current && posts.length > prevPostsLength.current) {
      const newScrollHeight = feedRef.current.scrollHeight;
      const scrollHeightDiff = newScrollHeight - lastScrollHeightRef.current;
      feedRef.current.scrollTop = scrollPositionRef.current + scrollHeightDiff;
      isLoadingMore.current = false;
    }
    prevPostsLength.current = posts.length;
  }, [posts.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = feedRef.current;
      scrollPositionRef.current = scrollTop;
      const postHeight = clientHeight;
      const newIndex = Math.floor(scrollTop / postHeight);

      if (
        newIndex !== currentIndex &&
        newIndex >= 0 &&
        newIndex < posts.length
      ) {
        setCurrentIndex(newIndex);
      }

      const scrollThreshold = 200;
      if (
        hasMore &&
        !isLoadingMore.current &&
        scrollTop + clientHeight >= scrollHeight - scrollThreshold
      ) {
        console.log("Loading more posts...");
        isLoadingMore.current = true;
        loadMorePosts();
      }
    };

    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener("scroll", handleScroll, { passive: true });
      return () => feedElement.removeEventListener("scroll", handleScroll);
    }
  }, [currentIndex, hasMore, loadMorePosts, posts.length]);

  return (
    <div
      {...handlers}
      ref={feedRef}
      className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar"
      style={{ touchAction: "pan-y" }}
    >
      {posts.map((post, index) => (
        <PetFeedItem
          key={post.id}
          post={post}
          onLike={onLike}
          onComment={onComment}
          isActive={index === currentIndex}
        />
      ))}
      {hasMore && (
        <div className="p-4 text-center text-gray-500">
          Loading more posts...
        </div>
      )}
    </div>
  );
}
