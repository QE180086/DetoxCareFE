import { api } from "../../api/Api";

export const cartApi = {
  getCart: async () => {
    const response = await api.get("/api/cart");
    return response.data;
  },

  getCartById: async (cartId) => {
    const response = await api.get(`/api/cart/${cartId}`);
    return response.data;
  },

  addToCart: async (cartData) => {
    const response = await api.post("/api/cart", cartData);
    return response.data;
  },

  removeVoucher: async (voucherData) => {
    const response = await api.put("/api/cart/remove-voucher", voucherData);
    return response.data;
  },

  applyVoucher: async (voucherData) => {
    const response = await api.put("/api/cart/apply-voucher", voucherData);
    return response.data;
  },

  calculateGhnFee: async (fullAddress, cartId) => {
    const response = await api.post("/api/ghn/calculate-fee", null, {
      params: {
        fullAddress: fullAddress,
        cartId: cartId
      }
    });
    return response.data;
  },
};
