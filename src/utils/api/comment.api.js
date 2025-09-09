import { api } from "../../api/Api";

export const commentApi = {
  update: async (commentId, commentData) => {
    const response = await api.put(`/api/comments/${commentId}`, commentData);
    return response.data;
  },

  delete: async (commentId) => {
    const response = await api.delete(`/api/comments/${commentId}`);
    return response.data;
  },

  addEmoji: async (commentId, emojiData) => {
    const response = await api.put(
      `/api/comments/emojis/${commentId}`,
      emojiData
    );
    return response.data;
  },

  getByBlogId: async (blogId) => {
    const response = await api.get(`/api/comments/${blogId}`);
    return response.data;
  },

  create: async (blogId, commentData) => {
    const response = await api.post(`/api/comments/${blogId}`, commentData);
    return response.data;
  },
};
