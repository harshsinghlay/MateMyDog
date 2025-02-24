import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Music2 } from 'lucide-react';
import type { PetPost } from '../../../types/pet';

interface PetFeedItemProps {
  post: PetPost;
  onLike: (postId: string) => void;
  isActive: boolean;
}

export function PetFeedItem({ post, onLike, isActive }: PetFeedItemProps) {
  const [isDoubleTapped, setIsDoubleTapped] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      onLike(post.id);
      setIsDoubleTapped(true);
      setTimeout(() => setIsDoubleTapped(false), 1000);
    }

    setLastTap(now);
  };

  return (
    <div 
      className="relative h-screen w-full snap-start touch-manipulation"
      onClick={handleTap}
    >
      {/* Media Content */}
      <div className="absolute inset-0 bg-black">
        <img
          src={post.mediaUrl}
          alt={post.caption}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Double Tap Heart Animation */}
      {isDoubleTapped && (
        <div className="absolute inset-0 flex items-center justify-center animate-scale-fade">
          <Heart className="h-24 w-24 text-white fill-current" />
        </div>
      )}

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60">
        <div className="absolute bottom-0 left-0 right-16 p-4 space-y-4">
          {/* Pet Info */}
          <div className="flex items-center space-x-3">
            <img
              src={post.petImageUrl}
              alt={post.petName}
              className="h-12 w-12 rounded-full border-2 border-white"
              loading="lazy"
            />
            <div>
              <h3 className="text-white font-semibold text-base">{post.petName}</h3>
              <p className="text-white/80 text-sm">{post.ownerName}</p>
            </div>
          </div>

          {/* Caption */}
          <p className="text-white text-sm line-clamp-2">{post.caption}</p>

          {/* Music */}
          <div className="flex items-center space-x-2">
            <Music2 className="h-4 w-4 text-white animate-spin-slow" />
            <p className="text-white text-sm truncate">{post.music}</p>
          </div>
        </div>

        {/* Engagement Buttons */}
        <div className="absolute right-2 bottom-20 flex flex-col items-center space-y-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
            className="group flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center mb-1 group-active:scale-90 transition-transform">
              <Heart className="h-6 w-6 text-white group-active:text-red-500" />
            </div>
            <span className="text-white text-xs">{post.likes}</span>
          </button>

          <button className="group flex flex-col items-center">
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center mb-1 group-active:scale-90 transition-transform">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-white text-xs">{post.comments}</span>
          </button>

          <button className="group flex flex-col items-center">
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center mb-1 group-active:scale-90 transition-transform">
              <Share2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-white text-xs">{post.shares}</span>
          </button>
        </div>
      </div>
    </div>
  );
}