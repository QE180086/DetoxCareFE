import axios from "axios";

// GHN API configuration
const GHN_API_URL = "https://dev-online-gateway.ghn.vn/shiip/public-api";
const GHN_TOKEN = "2c51ab05-aa8a-11f0-b040-4e257d8388b4";

// Create a single axios instance for all GHN API endpoints
const ghnApi = axios.create({
  baseURL: GHN_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Token": GHN_TOKEN
  },
});

export const addressApi = {
  // Get all provinces
  getProvinces: async () => {
    try {
      const response = await ghnApi.get("/master-data/province");
      return response.data;
    } catch (error) {
      console.error("Error fetching provinces:", error);
      throw error;
    }
  },

  // Get districts by province ID (passed in request body)
  getDistricts: async (provinceId) => {
    try {
      console.log("Sending district request with provinceId:", provinceId);
      const response = await ghnApi.post("/master-data/district", {
        province_id: parseInt(provinceId)
      });
      console.log("District response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching districts:", error);
      throw error;
    }
  },

  // Get wards by district ID (passed in request body)
  getWards: async (districtId) => {
    try {
      const response = await ghnApi.post("/master-data/ward?district_id", {
        district_id: parseInt(districtId)
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching wards:", error);
      throw error;
    }
  },
};