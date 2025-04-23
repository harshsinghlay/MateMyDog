import { supabase } from "../../supabase";
import type { CreatePostData } from "../../../types/social";
import type { SocialPost } from "../../../types/social";

class SocialService {
  async createPost(data: CreatePostData) {
    try {
      const { data: post, error: postError } = await supabase
        .from("social_posts")
        .insert({
          user_id: data.owner,
          pet_id: data.petId,
          image_url: data.imageUrl,
          story_text: data.storyText,
          hashtags: data.hashtags,
        })
        .select(`
          *,
          pet:pets (
            *,
           owner:profiles!user_id (
              id,
              full_name,
              email,
              is_active,
              location:addresses (
                id,
                city,
                state,
                country,
                postal_code,
                lat,
                lng
              )
            )
          )
        `)
        .single();
  
      if (postError) throw postError;
      if (!post) throw new Error("Failed to create post");

      return {
        id: post.id,
        petId: post.pet_id,
        petName: post.pet?.name,
        petImageUrl: post.pet?.image_url,
        ownerName : post.pet?.owner.full_name,
        location: post.pet?.owner?.location,
        imageUrl: post.image_url,
        storyText: post.story_text,
        hashtags: post.hashtags || [],
        likesCount: 0,
        commentsCount: 0,
        createdAt: post.created_at,
        isLiked: false,
      };
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }
  
  async getPosts(
    pageNum: number,
    p0: number,
    { offset, limit }: { offset: number; limit: number }
  ): Promise<SocialPost[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // First get all posts with their pet details
      const { data: posts, error: postsError } = await supabase
        .from("social_posts")
        .select(`
          *,
          pet:pets (
            id,
            name,
            image_url,
            is_active,
            owner:profiles!user_id (
              id,
              full_name,
              email,
              is_active,
              location:addresses (
                id,
                city,
                state,
                country,
                postal_code,
                lat,
                lng
              )
            )
          ),
          post_likes (
            user_id
          )
        `)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (postsError) throw postsError;
      if (!posts) return [];

      return posts.map((post) => ({
        id: post.id,
        userId: post.owner,
        petId: post.pet_id,
        petName: post.pet?.name,
        petImageUrl: post.pet?.image_url,
        ownerName : post.pet?.owner.full_name,
        imageUrl: post.image_url,
        storyText: post.story_text,
        hashtags: post.hashtags || [],
        location: post.pet.owner.location,
        likesCount: post.likes_count || 0,
        commentsCount: post.comments_count || 0,
        createdAt: post.created_at,
        isLiked: user
          ? post.post_likes?.some((like: any) => like.user_id === user.id)
          : false,
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }

  async likePost(postId: string) {
    console.log("I am likePost");
  
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
  
      if (userError) throw userError;
      if (!user) throw new Error("Not authenticated");
  
      // Check if user has already liked the post
      const { data: existingLike, error: likeCheckError } = await supabase
        .from("post_likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();
  
      if (likeCheckError) throw likeCheckError;
  
      if (existingLike) {
        // Unlike the post
        const { error: unlikeError } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);
  
        if (unlikeError) throw unlikeError;
      } else {
        // Like the post
        const { error: likeError } = await supabase.from("post_likes").insert({
          post_id: postId,
          user_id: user.id,
        });
  
        if (likeError) throw likeError;
      }
  
      return !existingLike; // true if liked, false if unliked
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  }
  


  async getComments(postId: string) {
    try {
      const { data: comments, error } = await supabase
        .from("post_comments")
        .select(
          `
          *,
          owner:profiles!user_id(*)
        `
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return comments.map((comment) => ({
        id: comment.id,
        postId: comment.post_id,
        userId: comment.owner,
        userName: comment.owner?.full_name || "Anonymous",
        userAvatar: comment.owner?.avatar_url,
        content: comment.content,
        createdAt: comment.created_at,
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  }

  async addComment(
    postId: string,
    content: string,
  ) {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Not authenticated");

      const { data: comment, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
        })
        .select(
          `
          *,
          owner:profiles!user_id(*)
        `
        )
        .single();

      if (error) throw error;
      if (!comment) throw new Error("Failed to create comment");

      return {
        id: comment.id,
        postId: comment.post_id,
        userId: comment.owner,
        userName: comment.owner?.full_name || "Anonymous",
        userAvatar: comment.owner?.avatar_url,
        content: comment.content,
        createdAt: comment.created_at,
      };
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }


  async getPetPosts(petId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: posts, error: postsError } = await supabase
        .from("social_posts")
        .select(
          `
          *,
          pet:pets (
           *,
            owner:profiles!user_id (
              id,
              full_name,
              email,
              is_active,
              location:addresses (
                id,
                city,
                state,
                country,
                postal_code,
                lat,
                lng
              )
            )
          ),
          post_likes (
            user_id
          )
        `
        )
        .eq("pet_id", petId)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;
      if (!posts) return [];

      return posts.map((post) => ({
        id: post.id,
        userId: post.owner,
        petId: post.pet_id,
        petName: post.pet.name,
        petImageUrl: post.pet.image_url,
        ownerName: post.pet.owner.full_name,
        imageUrl: post.image_url,
        storyText: post.story_text,
        hashtags: post.hashtags || [],
        location: post.pet.owner.location,
        likesCount: post.likes_count || 0,
        commentsCount: post.comments_count || 0,
        createdAt: post.created_at,
        isLiked: user
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          post.post_likes?.some((like: any) => like.user_id === user.id)
          : false,
      }));
    } catch (error) {
      console.error("Error fetching pet posts:", error);
      throw error;
    }
  }

  async getUserPosts(userId: string): Promise<SocialPost[]> {
    try {
      const { data: posts, error: postsError } = await supabase
        .from("social_posts")
        .select(
          `
          *,
          pet:pets (
           *,
           owner:profiles!user_id (
              id,
              full_name,
              email,
              is_active,
              location:addresses (
                id,
                city,
                state,
                country,
                postal_code,
                lat,
                lng
              )
            )
          ),
          post_likes (
            user_id
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;
      if (!posts) return [];

      const {
        data: { user },
      } = await supabase.auth.getUser();

      return posts.map((post) => ({
        id: post.id,
        userId: post.owner,
        petId: post.pet_id,
        petName: post.pet?.name,
        petImageUrl: post.pet?.image_url,
        ownerName: post.pet?.owner.full_name,
        imageUrl: post.image_url,
        // videoUrl: post.video_url,
        storyText: post.story_text,
        hashtags: post.hashtags || [],
        location: post.pet.owner.location,
        likesCount: post.likes_count || 0,
        commentsCount: post.comments_count || 0,
        createdAt: post.created_at,
        isLiked: user
          ? post.post_likes?.some((like: any) => like.user_id === user.id)
          : false,
          owner : post.user_id
      }));
    } catch (error) {
      console.error("Error fetching user posts:", error);
      throw error;
    }
  }
}


export const socialService = new SocialService();
