import { api } from "../../api/Api";

export const cartItemApi = {
  getAll: async (
    page = 1,
    size = 8,
    field = "createdDate",
    direction = "desc",
    accessToken
  ) => {
    const response = await api.get("/api/cart-item", {
      params: { page, size, field, direction},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  updateQuantityCart: async (cartItemData, accessToken) => {
    const response = await api.put("/api/cart-item", cartItemData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  addToCart: async (cartItemData, accessToken) => {
    const response = await api.post("/api/cart-item", cartItemData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  delete: async (cartItemId, accessToken) => {
    const response = await api.delete("/api/cart-item", {
      params: { cartItemId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("API delete response:", response);
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
