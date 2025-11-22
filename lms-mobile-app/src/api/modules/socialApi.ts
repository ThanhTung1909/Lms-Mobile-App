import apiClient from "../apiClient";

export interface PostItem {
  postId: string;
  userId: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  author: {
    fullName: string;
    avatarUrl?: string;
  };
}

// Lấy danh sách bài viết
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

// Đăng bài mới
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

// Like/Unlike bài viết
export const toggleLikePost = async (postId: string) => {
  try {
    const response = await apiClient.post(`/community/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Bình luận bài viết
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
