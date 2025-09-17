import { api } from "../../api/Api";

export const profileApi = {
  getProfile: async () => {
    const response = await api.get("/api/profile");
    return response.data;
  },

  updateProfile: async (profileData, accessToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
    const response = await api.put("/api/profile", profileData, config);
    return response.data;
  },
  
  uploadAvatar: async (file, accessToken) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`
      }
    };
    
    const response = await api.post("/api/images/upload", formData, config);
    return response.data;
  },

  getPointDetail: async (accessToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
    const response = await api.get("/api/point/detail", config);
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

  getUserById: async (userId, accessToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
    const response = await api.get(`/api/profile/user/${userId}`, config);
    return response.data;
  },
};