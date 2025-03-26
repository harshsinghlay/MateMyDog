import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/Tabs";
import { SocialPost } from "../../types/social";
import { socialService } from "../../lib/supabase/services/socialService";
import { useNavigate } from "react-router-dom";

interface UserPostsProps {
  userId: string;
}

export function UserPosts({ userId }: UserPostsProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserPosts = async () => {
      try {
        setLoading(true);
        const userPosts = await socialService.getUserPosts(userId);
        setPosts(userPosts);
      } catch (error) {
        console.error("Error loading user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserPosts();
  }, [userId]);

  const photoPosts = posts.filter((post) => post.imageUrl);
//   const videoPosts = posts.filter((post) => post.videoUrl);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-1 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 rounded-none"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="w-full border-b">
          <TabsTrigger value="photos" className="flex-1">
            Photos ({photoPosts.length})
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex-1">
            {/* Empty array for videos for now */}
            Videos ({[].length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos">
          <div className="grid grid-cols-3 gap-1">
            {photoPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/socialPost/${post.id}`)}
                className="aspect-square cursor-pointer relative group"
              >
                <img
                  src={post.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-3 gap-1">
            {/* {videoPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/socialPost/${post.id}`)}
                className="aspect-square cursor-pointer relative group"
              >
                <video
                  src={post.videoUrl}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
              </div>
            ))} */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}