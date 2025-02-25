import { useState, useRef, useEffect } from "react";
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

export function PetFeed({ posts, onLike, onComment, loadMorePosts, hasMore }: PetFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  const scrollToPost = (index: number) => {
    if (feedRef.current && index >= 0 && index < posts.length) {
      const postElement = feedRef.current.children[index] as HTMLElement;
      postElement.scrollIntoView({ behavior: "smooth" });
      setCurrentIndex(index);
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => scrollToPost(currentIndex + 1),
    onSwipedDown: () => scrollToPost(currentIndex - 1),
    trackMouse: true,
  });

  // Handle keyboard navigation
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
  }, [currentIndex]);

  // Handle scroll snap and infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (feedRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = feedRef.current;
        const postHeight = clientHeight;
        const newIndex = Math.round(scrollTop / postHeight);
        setCurrentIndex(newIndex);

        // Trigger loadMorePosts when near bottom
        if (hasMore && scrollTop + clientHeight >= scrollHeight - 10) {
          loadMorePosts();
        }
      }
    };

    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener("scroll", handleScroll);
      return () => feedElement.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, loadMorePosts]);

  return (
    <div
      {...handlers}
      ref={feedRef}
      className="h-[calc(100vh-4rem)] overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar"
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
      {hasMore && <div className="p-4 text-center text-gray-500">Loading more posts...</div>}
    </div>
  );
}
