import { api } from "../../api/Api";

export const productApi = {
  getAll: async (
    page = 1,
    size = 8,
    field = "createdDate",
    direction = "desc",
    searchText
  ) => {
    const response = await api.get("/api/product", {
      params: { page, size, field, direction, searchText },
    });
    return response.data;
  },

  getById: async (productId) => {
    const response = await api.get(`/api/product/${productId}`);
    return response.data;
  },

  update: async (productId, productData) => {
    const response = await api.put(`/api/product/${productId}`, productData);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post("/api/product", productData);
    return response.data;
  },

  delete: async (productId) => {
    const response = await api.delete(`/api/product/${productId}`);
    return response.data;
  },
};
