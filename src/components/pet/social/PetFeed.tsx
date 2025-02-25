import React, { useState, useRef, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { PetFeedItem } from "./PetFeedItem";
import type { SocialPost } from "../../../types/social";

const mockPosts: SocialPost[] = [
  {
    id: "1",
    userId: "user_1", // Placeholder, update as needed
    petId: "1",
    petName: "Luna",
    petImageUrl: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24",
    ownerName: "Sarah Johnson",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b",
    storyText: "", // Empty caption mapped to storyText
    hashtags: [], // No hashtags in the original data
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    likesCount: 0,
    commentsCount: 0,
    createdAt: "2024-03-15T10:30:00Z",
    isLiked: false, // Defaulting to false
  },
  {
    id: "2",
    userId: "user_2", // Placeholder, update as needed
    petId: "2",
    petName: "Rocky",
    petImageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95",
    ownerName: "Mike Wilson",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb",
    storyText: "Beach day with my best friend! 🏖️ #BeachDog #SummerVibes",
    hashtags: ["#BeachDog", "#SummerVibes"], // Extracted from caption
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    likesCount: 2567,
    commentsCount: 156,
    createdAt: "2024-03-14T15:45:00Z",
    isLiked: false, // Defaulting to false
  },
];

export function PetFeed() {
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
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
