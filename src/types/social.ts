export interface SocialPost {
  id: string;
  userId: string;
  petId: string;
  petName: string;
  petImageUrl: string;
  ownerName: string;
  imageUrl: string;
  storyText: string;
  hashtags: string[];
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
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

export interface CreatePostData {
  petId: string;
  imageUrl: string;
  storyText: string;
  hashtags: string[];
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}