import type { Address, User } from "./user";

export interface SocialPost {
  id: string;
  // userId: string;
  petId: string;
  petName: string;
  petImageUrl: string;
  ownerName: string;
  imageUrl: string;
  storyText: string;
  hashtags: string[];
  location: Address;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}
export interface PostLike {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface CreatePostData {
  owner: User | String;
  petId: string;
  imageUrl: string;
  storyText: string;
  hashtags: string[];
}