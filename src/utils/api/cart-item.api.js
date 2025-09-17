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
    const response = await api.delete("/api/cart-item/{cartItemId}", {
      params: { cartItemId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getDetail: async () => {
    const response = await api.get("/api/cart-item/detail");
    return response.data;
  },

  deleteAll: async (accessToken) => {
    const response = await api.delete("/api/cart-item/all", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getUserVouchers: async (page = 1, size = 8, field = "createdDate", direction = "desc", userId, accessToken) => {
    
    // Check if required parameters are present
    if (!userId) {
      throw new Error("userId is required");
    }
    
    if (!accessToken) {
      throw new Error("accessToken is required");
    }
    
    try {
      const response = await api.get("/api/user-vouchers", {
        params: { page, size, field, direction, userId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  removeVoucher: async (voucherCode, accessToken) => {
    const response = await api.put("/api/cart/remove-voucher", {}, {
      params: { voucherCode },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  applyVoucher: async (voucherCode, accessToken) => {
    const response = await api.put("/api/cart/apply-voucher", {}, {
      params: { voucherCode },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
  
  // New POST /api/cart endpoint
  createCart: async (cartData, accessToken) => {
    const response = await api.post("/api/cart", cartData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
  
  // New POST /api/payment endpoint
  createPayment: async (paymentData, accessToken) => {
    const response = await api.post("/api/payment", paymentData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};