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

  getTypeProducts: async (
    page = 1,
    size = 8,
    field = "createdDate",
    direction = "desc",
    searchText
  ) => {
    const response = await api.get("/api/type-product", {
      params: { page, size, field, direction, searchText },
    });
    return response.data;
  },

  // New API endpoint for posting ratings with token authentication
  postRating: async (productId, ratingData, accessToken) => {
    const response = await api.post(`/api/rate`, ratingData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { productId },
    });
    return response.data;
  },

  // New API endpoint for updating ratings with token authentication
  updateRating: async (rateId, ratingData, accessToken) => {
    const response = await api.put(`/api/rate/${rateId}`, ratingData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  // New API endpoint for exchanging vouchers with token authentication
  exchangeVoucher: async (voucherData, accessToken) => {
    const response = await api.post(`/api/user-vouchers/exchange`, voucherData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  // New API endpoint for asking questions to Gemini AI
  askGemini: async (questionData) => {
    const response = await api.post(`/api/gemini/ask`, questionData, {
    });
    return response.data;
  },
};