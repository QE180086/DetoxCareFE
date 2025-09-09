import { api } from "../../api/Api";

export const blogApi = {
  getAll: async (
    page = 1,
    size = 8,
    field = "createdDate",
    direction = "desc",
    searchText
  ) => {
    const response = await api.get("/api/blogs", {
      params: { page, size, field, direction, searchText },
    });
    return response.data;
  },

  getById: async (blogId) => {
    const response = await api.get(`/api/blogs/blog-id/${blogId}`);
    return response.data;
  },

  getBySlugName: async (slugName) => {
    const response = await api.get(`/api/blogs/${slugName}`);
    return response.data;
  },

  search: async (searchParams) => {
    const response = await api.get("/api/blogs/search", {
      params: searchParams,
    });
    return response.data;
  },

  getByCategory: async (category) => {
    const response = await api.get(`/api/blogs/interactive/${category}`);
    return response.data;
  },

  getBlogsByCategory: async (categoryParams) => {
    const response = await api.get("/api/blogs/get-by-category", {
      params: categoryParams,
    });
    return response.data;
  },

  update: async (blogId, blogData) => {
    const response = await api.put(`/api/blogs/${blogId}`, blogData);
    return response.data;
  },

  updateBySlugName: async (slugName, blogData) => {
    const response = await api.put(`/api/blogs/${slugName}`, blogData);
    return response.data;
  },

  updateByBlogId: async (blogId, blogData) => {
    const response = await api.put(`/api/blogs/blog-id/${blogId}`, blogData);
    return response.data;
  },

  show: async (slugName) => {
    const response = await api.put(`/api/blogs/show/${slugName}`);
    return response.data;
  },

  addEmoji: async (id, emojiData) => {
    const response = await api.put(`/api/blogs/emoji/${id}`, emojiData);
    return response.data;
  },

  create: async (blogData) => {
    const response = await api.post("/api/blogs", blogData);
    return response.data;
  },

  delete: async (blogId) => {
    const response = await api.delete(`/api/blogs/${blogId}`);
    return response.data;
  },
};
