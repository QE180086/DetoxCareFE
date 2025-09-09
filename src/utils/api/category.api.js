import { api } from "../../api/Api";

export const categoryApi = {
  getAll: async (
    page = 1,
    size = 8,
    field = "createdDate",
    direction = "desc"
  ) => {
    const response = await api.get("/api/category", {
      params: { page, size, field, direction },
    });
    return response.data;
  },

  getById: async (categoryId) => {
    const response = await api.get(`/api/category/${categoryId}`);
    return response.data;
  },

  update: async (categoryId, categoryData) => {
    const response = await api.put(`/api/category/${categoryId}`, categoryData);
    return response.data;
  },

  create: async (categoryData) => {
    const response = await api.post("/api/category", categoryData);
    return response.data;
  },

  delete: async (categoryId) => {
    const response = await api.delete(`/api/category/${categoryId}`);
    return response.data;
  },
};
