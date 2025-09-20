import { api } from "../../api/Api";

export const authApi = {
  login: async (loginData) => {
    const response = await api.post("/api/auth/login", loginData);
    return response.data;
  },

  register: async (registerData) => {
    const response = await api.post("/api/auth/register", registerData);
    return response.data;
  },

  sendOTP: async (otpData) => {
    const response = await api.post("/api/auth/sendOTP", otpData);
    return response.data;
  },

  verifyOTP: async (verifyData) => {
    const response = await api.post("/api/auth/verifyOTP", verifyData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/api/user/getme");
    return response.data;
  },
};