import { useState, useCallback, memo, useRef } from "react";
import { Heart, MessageCircle, Share2, Music2 } from "lucide-react";
import { SharePetProfile } from "../pet/share/SharePetProfile";
import { useDebounce } from "../../hooks/useDebounce";
import type { SocialPost } from "../../types/social";
import type { Pet } from "../../types/pet";
import { CommentsModal } from "./CommentsModal";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
interface PetFeedItemProps {
  post: SocialPost;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  isActive?: boolean;
}

const PetFeedItem = memo(function PetFeedItem({
  post,
  onLike,
  onComment,
}: PetFeedItemProps) {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [showShare, setShowShare] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentsCount);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const lastTap = useRef<number | null>(null);

  const mockPet: Pet = {
    id: post.petId,
    name: post.petName,
    imageUrl: post.petImageUrl,
    ownerName: post.ownerName,
    location: post.location,
    breed: "",
    age: 0,
    gender: "male",
    ownerId: "",
    dateOfBirth: "",
    weight: 0,
    microchipId: "",
    temperament: [],
    medicalHistory: [],
    vaccinations: [],
    media: [],
    likes: [],
    reviews: [],
    comments: [],
    rating: 0,
  };

  const { execute: debouncedLike } = useDebounce(onLike, {
    delay: 500,
    onError: () => {
      setIsLiked(post.isLiked);
      setLikeCount(post.likesCount);
    },
  });

  const handleLike = useCallback(() => {
    if (!isAuthenticated) {
      toast("Please sign in to like posts", { icon: "🔒" });
      return;
    }
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    debouncedLike(post.id);
  }, [isLiked, post.id, debouncedLike, isAuthenticated]);

  const handleCommentClick = () => {
    if (!isAuthenticated) {
      toast("Please sign in to comment", { icon: "🔒" });
      return;
    }
    setIsCommentOpen(true);
  };

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      handleLike();
    }
    lastTap.current = now;
  };

  const handleCommentAdded = useCallback(
    async (content: string) => {
      try {
        await onComment(post.id, content);
        setCommentCount((prev) => prev + 1);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    },
    [onComment, post.id]
  );

  return (
    <div className="relative h-full w-full snap-start touch-manipulation ">
      <div className="absolute inset-0 bg-black" onClick={handleTap}>
        <img
          src={post.imageUrl}
          alt={post.petName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60">
        <div className="absolute bottom-16 md:bottom-0 left-0 right-16 p-4 space-y-4">
          {/* Pet Info */}
          <div className="flex items-center space-x-3">
            <img
              src={post.petImageUrl}
              alt={post.petName}
              className="h-12 w-12 rounded-full border-2 border-white"
              loading="lazy"
            />
            <div>
              <h3 className="text-white font-semibold text-base">
                {post.petName}
              </h3>
              <p className="text-white/80 text-sm">{post.ownerName}</p>
            </div>
          </div>

          {/* Caption */}
          <p className="text-white text-sm line-clamp-2">{post.storyText}</p>

          {/* Music */}
          <div className="flex items-center space-x-2">
            <Music2 className="h-4 w-4 text-white animate-spin-slow" />
            <p className="text-white text-sm truncate">
              {"Let Me Down Slowly.."}
            </p>
          </div>
        </div>

        <div className="absolute right-2 bottom-20 md:bottom-24 flex flex-col items-center space-y-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className="group flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center mb-1">
              <Heart
                className={`h-6 w-6 ${
                  isLiked ? "text-red-500 fill-current" : "text-white"
                }`}
              />
            </div>
            <span className="text-white text-xs">{likeCount}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCommentClick();
            }}
            className="group flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center mb-1">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-white text-xs">{commentCount}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShare(true);
            }}
            className="group flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center mb-1">
              <Share2 className="h-6 w-6 text-white" />
            </div>
          </button>
        </div>
      </div>

      {isCommentOpen && (
        <CommentsModal
          postId={post.id}
          onClose={() => setIsCommentOpen(false)}
          onCommentAdded={handleCommentAdded}
        />
      )}

      {/* Share Modal */}
      {showShare && (
        <SharePetProfile
          pet={mockPet}
          postId={post.id}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
});

export { PetFeedItem };
