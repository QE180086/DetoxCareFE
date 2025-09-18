import {
  FORGET_PASSWORD_FAILURE,
  FORGET_PASSWORD_REQUEST,
  FORGET_PASSWORD_SUCCESS,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  SEND_OTP_FAILURE,
  SEND_OTP_REQUEST,
  SEND_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  SET_ACCESS_TOKEN,
} from "./ActionType";
import { authApi } from "../../utils/api/auth.api";
import { api } from "../../api/Api";
import { fetchCartFromServer } from "../Cart/Action";
import { profileApi } from "../../utils/api/profile.api";

// Action to set access token directly
export const setAccessToken = (token) => ({
  type: SET_ACCESS_TOKEN,
  payload: token,
});

// Helper function to load cart from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

// Helper function to clear local cart
const clearLocalCart = () => {
  try {
    localStorage.removeItem('guestCart');
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
};

// Function to synchronize local cart with server cart
const syncLocalCartToServer = (accessToken, dispatch) => async () => {
  try {
    // Load local cart items
    const localCartItems = loadCartFromLocalStorage();
    
    if (localCartItems.length === 0) {
      // No items in local cart, nothing to sync
      return;
    }
    
    console.log("Syncing local cart items to server:", localCartItems);
    
    // For each item in local cart, add it to server cart
    // In a more sophisticated implementation, we would check if items already exist
    // and update quantities accordingly, but for now we'll just add them
    for (const item of localCartItems) {
      try {
        // Prepare cart item data
        const cartItemData = {
          productId: item.productId || item.id,
          quantity: item.quantity || 1
        };
        
        // Add item to server cart
        await api.post("/api/cart-item", cartItemData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        console.error("Failed to sync item to server:", item, error);
        // Continue with other items even if one fails
      }
    }
    
    // Clear local cart after successful sync
    clearLocalCart();
    
    // Fetch updated cart from server
    dispatch(fetchCartFromServer());
    
    console.log("Local cart sync completed successfully");
  } catch (error) {
    console.error("Failed to sync local cart to server:", error);
    // Don't throw error to avoid breaking the login flow
  }
};

// register
export const registerUser = (reqData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    // Bước 1: Gửi yêu cầu đăng ký
    const registerData = await authApi.register(reqData.userData);

    // Bước 2: Gửi OTP
    dispatch({ type: SEND_OTP_REQUEST });
    const otpData = await authApi.sendOTP({
      email: reqData.userData.email,
    });

    if (otpData.success) {
      dispatch({ type: SEND_OTP_SUCCESS, payload: otpData });
      // Trả về dữ liệu để frontend lưu tạm
      return {
        registerData,
        email: reqData.userData.email,
        navigate: reqData.navigate,
      };
    } else {
      throw new Error("Không thể gửi OTP");
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message?.messageDetail || "Đăng ký thất bại";
    dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
    dispatch({ type: SEND_OTP_FAILURE, payload: errorMessage });
    console.error("Lỗi đăng ký hoặc gửi OTP:", error);
    throw error;
  }
};

// verifyOTP
export const verifyOtp =
  ({ email, otp, registerData, navigate }) =>
  async (dispatch) => {
    dispatch({ type: VERIFY_OTP_REQUEST });
    try {
      // Bước 3: Xác thực OTP
      const verifyData = await authApi.verifyOTP({
        email,
        otp,
      });

      if (verifyData.success) {
        if (registerData.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/login");
        }
        dispatch({ type: VERIFY_OTP_SUCCESS, payload: verifyData });
      } else {
        throw new Error("Mã OTP không hợp lệ");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message?.messageDetail || "Xác thực OTP thất bại";
      dispatch({ type: VERIFY_OTP_FAILURE, payload: errorMessage });
      console.error("Lỗi xác thực OTP:", error);
      throw error;
    }
  };

export const resendOtp = (email) => async (dispatch) => {
  dispatch({ type: SEND_OTP_REQUEST });
  try {
    const otpData = await authApi.sendOTP({
      email,
    });
    console.log("Phản hồi gửi lại OTP:", otpData); // Debug
    if (otpData.success) {
      dispatch({ type: SEND_OTP_SUCCESS, payload: otpData });
      return { success: true, message: "OTP đã được gửi lại!" };
    } else {
      throw new Error(
        otpData.message?.messageDetail || otpData.message || "Không thể gửi OTP"
      );
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message?.messageDetail || "Gửi lại OTP thất bại";
    dispatch({ type: SEND_OTP_FAILURE, payload: errorMessage });
    throw error;
  }
};

// login
export const loginUser = (reqData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const data = await authApi.login(reqData.userData);

    const accessToken = data?.data?.accessToken;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", data?.data?.userId);
      localStorage.setItem("username", data?.data?.username);
      localStorage.setItem("email", data?.data?.email);
      
      // Fetch user profile to get avatar and store it in localStorage
      try {
        const profileResponse = await profileApi.getUserById(data?.data?.userId, accessToken);
        if (profileResponse?.data?.avatar) {
          localStorage.setItem("userAvatar", profileResponse.data.avatar);
        }
      } catch (profileError) {
        console.error("Failed to fetch user profile for avatar:", profileError);
      }
      
      // Sync local cart to server after successful login
      await syncLocalCartToServer(accessToken, dispatch)();
    }

    if (data.role === "ADMIN") {
      reqData.navigate("/admin");
    } else {
      reqData.navigate("/");
    }

    dispatch({ type: LOGIN_SUCCESS, payload: accessToken });
    
    // Fetch cart to load user's cart from server
    dispatch(fetchCartFromServer());
  } catch (error) {
    // Better error handling for the specific error you're seeing
    let errorMessage = "Đăng nhập thất bại";
    if (error?.response?.data?.message) {
      if (typeof error.response.data.message === 'object') {
        if (error.response.data.message.messageDetail) {
          errorMessage = error.response.data.message.messageDetail;
        } else if (error.response.data.message.messageCode) {
          errorMessage = `Error code: ${error.response.data.message.messageCode}`;
        } else {
          errorMessage = JSON.stringify(error.response.data.message);
        }
      } else {
        errorMessage = error.response.data.message;
      }
    }
    
    dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
    throw error;
  }
};

// forget password
export const forgetPassword =
  ({ email, username }) =>
  async (dispatch) => {
    dispatch({ type: FORGET_PASSWORD_REQUEST });
    try {
      const { data } = await api.post("/api/user/forget-password", {
        email,
        username,
      });

      dispatch({ type: FORGET_PASSWORD_SUCCESS, payload: data });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message?.messageDetail ||
        "Forget password request thất bại";
      dispatch({ type: FORGET_PASSWORD_FAILURE, payload: errorMessage });
      return { error: errorMessage };
    }
  };

// reset password
export const resetPassword = (reqData) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const { data } = await api.post("/api/user/reset-password", reqData);

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message?.messageDetail ||
      "Reset password request thất bại";
    dispatch({ type: RESET_PASSWORD_FAILURE, payload: errorMessage });
    throw error;
  }
};

export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const { data } = await api.get("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({ type: GET_USER_SUCCESS, payload: data });
  } catch (error) {
    // Better error handling
    let errorMessage = "Failed to fetch user profile";
    if (error?.response?.data?.message) {
      if (typeof error.response.data.message === 'object') {
        if (error.response.data.message.messageDetail) {
          errorMessage = error.response.data.message.messageDetail;
        } else if (error.response.data.message.messageCode) {
          errorMessage = `Error code: ${error.response.data.message.messageCode}`;
        } else {
          errorMessage = JSON.stringify(error.response.data.message);
        }
      } else {
        errorMessage = error.response.data.message;
      }
    }
    
    console.log("getUser: " + errorMessage);
  }
};

export const logout = () => (dispatch) => {
  try {
    // Instead of clearing all localStorage, selectively remove items
    // This preserves guestCart and other non-auth related items
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('userAvatar');
    
    // Dispatch LOGOUT to reset Redux state
    dispatch({ type: LOGOUT });
    
    // Also dispatch SET_ACCESS_TOKEN with null to ensure state is cleared
    dispatch(setAccessToken(null));
    
    // Fetch cart to load guest cart (if any) or initialize empty cart
    dispatch(fetchCartFromServer());
    
    console.log("logout success");
  } catch (error) {
    console.log("Logout: " + error);
  }
};