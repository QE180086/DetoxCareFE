import { api } from "../../api/Api";

export const ordersApi = {
  getAll: async (
    page = 1,
    size = 8,
    field = "createdDate",
    direction = "desc"
  ) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await api.get("/api/orders/user", {
      params: { page, size, field, direction },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getById: async (orderId) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await api.get(`/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },
};
