import { FORGET_PASSWORD_FAILURE, FORGET_PASSWORD_REQUEST, FORGET_PASSWORD_SUCCESS, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, RESET_PASSWORD_FAILURE, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, SEND_OTP_FAILURE, SEND_OTP_REQUEST, SEND_OTP_SUCCESS, VERIFY_OTP_FAILURE, VERIFY_OTP_REQUEST, VERIFY_OTP_SUCCESS } from "./ActionType"
import axios from "axios"
import { API_URL } from "../../api/Api"
// registerregister
export const registerUser = (reqData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        // Bước 1: Gửi yêu cầu đăng ký
        const { data: registerData } = await axios.post(`${API_URL}/api/auth/register`, reqData.userData);

        // Bước 2: Gửi OTP
        dispatch({ type: SEND_OTP_REQUEST });
        const { data: otpData } = await axios.post(`${API_URL}/api/auth/sendOTP`, {
            email: reqData.userData.email,
        });

        if (otpData.success) {
            dispatch({ type: SEND_OTP_SUCCESS, payload: otpData });
            // Trả về dữ liệu để frontend lưu tạm
            return { registerData, email: reqData.userData.email, navigate: reqData.navigate };
        } else {
            throw new Error('Không thể gửi OTP');
        }
    } catch (error) {
        //   const errorMessage = error.response?.message?.messageDetail || 'Đăng ký thất bại';
        const errorMessage =
            error.response?.data?.message?.messageDetail || 'Đăng ký thất bại';
        dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
        dispatch({ type: SEND_OTP_FAILURE, payload: errorMessage });
        console.error('Lỗi đăng ký hoặc gửi OTP:', error);
        throw error;
    }
};

// verifyOTP
export const verifyOtp = ({ email, otp, registerData, navigate }) => async (dispatch) => {
    dispatch({ type: VERIFY_OTP_REQUEST });
    try {
        // Bước 3: Xác thực OTP
        const { data: verifyData } = await axios.post(`${API_URL}/api/auth/verifyOTP`, {
            email,
            otp,
        });

        if (verifyData.success) {
            if (registerData.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/login');
            }
            dispatch({ type: VERIFY_OTP_SUCCESS, payload: verifyData });
        } else {
            throw new Error('Mã OTP không hợp lệ');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message?.messageDetail || 'Xác thực OTP thất bại';
        dispatch({ type: VERIFY_OTP_FAILURE, payload: errorMessage });
        console.error('Lỗi xác thực OTP:', error);
        throw error;
    }
};

export const resendOtp = (email) => async (dispatch) => {
    dispatch({ type: SEND_OTP_REQUEST });
    try {
        const { data: otpData } = await axios.post(`${API_URL}/api/auth/sendOTP`, { email });
        console.log('Phản hồi gửi lại OTP:', otpData); // Debug
        if (otpData.success) {
            dispatch({ type: SEND_OTP_SUCCESS, payload: otpData });
            return { success: true, message: 'OTP đã được gửi lại!' };
        } else {
            throw new Error(otpData.message?.messageDetail || otpData.message || 'Không thể gửi OTP');
        }
    } catch (error) {
        const errorMessage =
            error.response?.data?.message?.messageDetail || 'Gửi lại OTP thất bại';
        dispatch({ type: SEND_OTP_FAILURE, payload: errorMessage });
        throw error;
    }
};

// login
export const loginUser = (reqData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
        const { data } = await axios.post(`${API_URL}/api/auth/login`, reqData.userData);
        
        const accessToken = data?.data?.accessToken;

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
                        localStorage.setItem("userId", data?.data?.userId);
            localStorage.setItem("username", data?.data?.username);
            localStorage.setItem("email", data?.data?.email);

        }

        if (data.role === "ADMIN") {
            reqData.navigate("/admin");
        } else {
            reqData.navigate("/");
        }

        dispatch({ type: LOGIN_SUCCESS, payload: accessToken });
    } catch (error) {
        const errorMessage = error?.response?.data?.message?.messageDetail || 'Đăng nhập thất bại';
        dispatch({ type: LOGIN_FAILURE, payload: errorMessage });
        throw error;
    }
};

// forget password
export const forgetPassword = ({email, username}) => async (dispatch) => {
    dispatch({ type: FORGET_PASSWORD_REQUEST })
    try {
        const { data } = await axios.post(`${API_URL}/api/user/forget-password`, {email, username})
    
        dispatch({ type: FORGET_PASSWORD_SUCCESS, payload: data})
    } catch (error) {
        const errorMessage = error?.response?.data?.message?.messageDetail || 'Forget password request thất bại';
        dispatch({ type: FORGET_PASSWORD_FAILURE, payload: errorMessage });
        return { error: errorMessage };
    }
}

// reset password

export const resetPassword = (reqData) => async (dispatch) => {
    dispatch({ type: RESET_PASSWORD_REQUEST })
    try {
        const { data } = await axios.post(`${API_URL}/api/user/reset-password`, reqData)
    
        dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data })
    } catch (error) {
        const errorMessage = error?.response?.data?.message?.messageDetail || 'Reset password request thất bại';
        dispatch({ type: RESET_PASSWORD_FAILURE, payload: errorMessage });
        throw error;
    }
}

export const getUser = (jwt) => async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST })
    try {
        const { data } = await axios.get(`${API_URL}/api/users/profile`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })

        dispatch({ type: GET_USER_SUCCESS, payload: data })

    } catch (error) {
        console.log('getUser: ' + error)
    }
}
export const logout = () => async (dispatch) => {
    dispatch({ type: LOGOUT })
    try {
        localStorage.clear()
        dispatch({ type: LOGOUT })
        console.log("logout suscess")

    } catch (error) {
        console.log('Logout: ' + error)
    }
}