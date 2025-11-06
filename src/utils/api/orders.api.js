import { api } from "../../api/Api";

export const ordersApi = {
  getAll: async (
    page = 1,
    size = 8,
    field = "createdDate",
    direction = "desc"
  ) => {
    const accessToken = sessionStorage.getItem("accessToken");
    const userId = sessionStorage.getItem("userId");
    const response = await api.get("/api/orders/user", {
      params: { page, size, field, direction, userId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getById: async (orderId) => {
    const accessToken = sessionStorage.getItem("accessToken");
    const response = await api.get(`/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getGhnOrderDetail: async (orderCode) => {
    const accessToken = sessionStorage.getItem("accessToken");
    const response = await api.post("/api/ghn/order-detail", {}, {
      params: { order_code: orderCode },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};
