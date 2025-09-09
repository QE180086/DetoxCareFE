import { api } from "../../api/Api";

export const cartItemApi = {
  getAll: async () => {
    const response = await api.get("/api/cart-item");
    return response.data;
  },

  update: async (cartItemData) => {
    const response = await api.put("/api/cart-item", cartItemData);
    return response.data;
  },

  create: async (cartItemData) => {
    const response = await api.post("/api/cart-item", cartItemData);
    return response.data;
  },

  delete: async () => {
    const response = await api.delete("/api/cart-item");
    return response.data;
  },

  getDetail: async () => {
    const response = await api.get("/api/cart-item/detail");
    return response.data;
  },

  deleteAll: async () => {
    const response = await api.delete("/api/cart-item/all");
    return response.data;
  },
};
