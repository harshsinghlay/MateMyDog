import React, { useState, useRef, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { PetFeedItem } from "./PetFeedItem";
import type { SocialPost } from "../../../types/social";



export function PetFeed() {
  const [posts, setPosts] = useState<SocialPost[]>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, likesCount: post?.likesCount + 1 };
        }
        return post;
      })
    );
  };

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
    // preventDefaultTouchmoveEvent: true,
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

  // Handle scroll snap
  useEffect(() => {
    const handleScroll = () => {
      if (feedRef.current) {
        const scrollTop = feedRef.current.scrollTop;
        const postHeight = window.innerHeight;
        const newIndex = Math.round(scrollTop / postHeight);
        setCurrentIndex(newIndex);
      }
    };

    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener("scroll", handleScroll);
      return () => feedElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div
      {...handlers}
      ref={feedRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      style={{ touchAction: "pan-y pinch-zoom" }}
    >
      {posts.map((post, index) => (
        <PetFeedItem
          key={post.id}
          post={post}
          onLike={handleLike}
          isActive={index === currentIndex}
        />
      ))}
    </div>
  );
}
