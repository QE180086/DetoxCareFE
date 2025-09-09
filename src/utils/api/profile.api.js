import { api } from "../../api/Api";

export const profileApi = {
  getProfile: async () => {
    const response = await api.get("/api/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/api/profile", profileData);
    return response.data;
  },

  setDefaultAddress: async (addressId) => {
    const response = await api.put(`/api/profile/address-default/${addressId}`);
    return response.data;
  },

  getProfileById: async (profileId) => {
    const response = await api.get(`/api/profile/${profileId}`);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/api/profile/user/${userId}`);
    return response.data;
  },
};
