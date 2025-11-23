import apiClient from "../apiClient";


export interface PostItem {
  _id: string;
  userId: string;
  content: string;
  imageUrls: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked: boolean;
  user?: {
    userId: string;
    fullName: string;
    avatarUrl: string | null;
  };
  author?: {
    fullName: string;
    avatarUrl: string | null;
  };
}


export interface CommentItem {
  _id: string;
  content: string;
  userId: string;
  createdAt: string;
  user: {
    userId: string;
    fullName: string;
    avatarUrl: string | null;
  };
}


export interface PostDetail extends PostItem {
  comments: CommentItem[];
  likeCount: number;
}



export const getPosts = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(
      `/community/posts?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPost = async (content: string, imageUrl?: string) => {
  try {
    const response = await apiClient.post("/community/posts", {
      content,
      imageUrl,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleLikePost = async (postId: string) => {
  try {
    const response = await apiClient.post(`/community/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createComment = async (postId: string, content: string) => {
  try {
    const response = await apiClient.post(
      `/community/posts/${postId}/comments`,
      { content },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPostDetail = async (postId: string) => {
  try {
    const response = await apiClient.get(`/community/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
