import React, { useState, useRef, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { PetFeedItem } from './PetFeedItem';
import type { PetPost } from '../../../types/pet';

const mockPosts: PetPost[] = [
  {
    id: '1',
    petId: '1',
    petName: 'Luna',
    petImageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24',
    ownerName: 'Sarah Johnson',
    mediaUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
    caption: '',
    likes: 0,
    comments: 0,
    shares: 0,
    music: 'Original Sound - Luna',
    timestamp: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    petId: '2',
    petName: 'Rocky',
    petImageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95',
    ownerName: 'Mike Wilson',
    mediaUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb',
    caption: 'Beach day with my best friend! 🏖️ #BeachDog #SummerVibes',
    likes: 2567,
    comments: 156,
    shares: 78,
    music: 'Summer Vibes - Pet Playlist',
    timestamp: '2024-03-14T15:45:00Z'
  }
];

export function PetFeed() {
  const [posts, setPosts] = useState<PetPost[]>(mockPosts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const scrollToPost = (index: number) => {
    if (feedRef.current && index >= 0 && index < posts.length) {
      const postElement = feedRef.current.children[index] as HTMLElement;
      postElement.scrollIntoView({ behavior: 'smooth' });
      setCurrentIndex(index);
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => scrollToPost(currentIndex + 1),
    onSwipedDown: () => scrollToPost(currentIndex - 1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        scrollToPost(currentIndex - 1);
      } else if (e.key === 'ArrowDown') {
        scrollToPost(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      feedElement.addEventListener('scroll', handleScroll);
      return () => feedElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div 
      {...handlers}
      ref={feedRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      style={{ touchAction: 'pan-y pinch-zoom' }}
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