import { supabase } from "../../supabase";
import type { CreatePostData } from "../../../types/social";

class SocialService {
  async createPost(data: CreatePostData) {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Not authenticated");

      // Get pet details first
      const { data: pet, error: petError } = await supabase
        .from("pets")
        .select("name, image_url, owner_name")
        .eq("id", data.petId)
        .single();

      if (petError) throw petError;
      if (!pet) throw new Error("Pet not found");

      // Create post
      const { data: post, error: postError } = await supabase
        .from("social_posts")
        .insert({
          user_id: user.id,
          pet_id: data.petId,
          image_url: data.imageUrl,
          story_text: data.storyText,
          hashtags: data.hashtags,
          location: data.location,
        })
        .select("*, pets(*)")
        .single();

      if (postError) throw postError;
      if (!post) throw new Error("Failed to create post");

      return {
        id: post.id,
        userId: post.user_id,
        petId: post.pet_id,
        petName: post.pets.name,
        petImageUrl: post.pets.image_url,
        ownerName: post.pets.owner_name,
        imageUrl: post.image_url,
        storyText: post.story_text,
        hashtags: post.hashtags || [],
        location: post.location,
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

  async getPosts() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // First get all posts with their pet details
      const { data: posts, error: postsError } = await supabase
        .from("social_posts")
        .select(
          `
          *,
          pets (
            name,
            image_url,
            owner_name
          ),
          post_likes (
            user_id
          )
        `
        )
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;
      if (!posts) return [];

      return posts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        petId: post.pet_id,
        petName: post.pets?.name,
        petImageUrl: post.pets?.image_url,
        ownerName: post.pets?.owner_name,
        imageUrl: post.image_url,
        storyText: post.story_text,
        hashtags: post.hashtags || [],
        location: post.location,
        likesCount: post.likes_count || 0,
        commentsCount: post.comments_count || 0,
        createdAt: post.created_at,
        isLiked: user
          ? post.post_likes?.some((like) => like.user_id === user.id)
          : false,
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }

  async likePost(postId: string) {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Not authenticated");

      // Check if user has already liked the post
      const { data: existingLike } = await supabase
        .from("post_likes")
        .select()
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

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

      return !existingLike; // Return true if liked, false if unliked
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  }

  async unlikePost(postId: string) {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error unliking post:", error);
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
          user_metadata
        `
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return comments.map((comment) => ({
        id: comment.id,
        postId: comment.post_id,
        userId: comment.user_id,
        userName: comment.user_metadata?.fullName || "Anonymous",
        userAvatar: comment.user_metadata?.avatarUrl,
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
    userMetadata: { fullName: string; avatarUrl: string }
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
          user_metadata: userMetadata, // Pass user metadata from context
        })
        .select("*")
        .single();

      if (error) throw error;
      if (!comment) throw new Error("Failed to create comment");

      return {
        id: comment.id,
        postId: comment.post_id,
        userId: comment.user_id,
        userName: comment.user_metadata?.fullName || "Anonymous",
        userAvatar: comment.user_metadata?.avatarUrl,
        content: comment.content,
        createdAt: comment.created_at,
      };
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }

  async deleteComment(commentId: string) {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("post_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting comment:", error);
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
          pets (
            name,
            image_url,
            owner_name
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
        userId: post.user_id,
        petId: post.pet_id,
        petName: post.pets.name,
        petImageUrl: post.pets.image_url,
        ownerName: post.pets.owner_name,
        imageUrl: post.image_url,
        storyText: post.story_text,
        hashtags: post.hashtags || [],
        location: post.location,
        likesCount: post.likes_count || 0,
        commentsCount: post.comments_count || 0,
        createdAt: post.created_at,
        isLiked: user
          ? post.post_likes?.some((like) => like.user_id === user.id)
          : false,
      }));
    } catch (error) {
      console.error("Error fetching pet posts:", error);
      throw error;
    }
  }
}

export const socialService = new SocialService();
