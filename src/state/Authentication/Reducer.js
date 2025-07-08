import {
    ADD_TO_FAVOURITE_REQUEST, FORGET_PASSWORD_FAILURE, FORGET_PASSWORD_REQUEST, FORGET_PASSWORD_SUCCESS, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE,
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, RESET_PASSWORD_FAILURE, RESET_PASSWORD_SUCCESS, SEND_OTP_FAILURE, SEND_OTP_SUCCESS, VERIFY_OTP_FAILURE, VERIFY_OTP_REQUEST,
    VERIFY_OTP_SUCCESS
} from "./ActionType";

const initialState = {
    user: null,
    isLoading: false,
    error: null,
    accessToken: null,
    favorites: [],
    success: null,
    otpSent: false,
    otpVerified: false
}

export const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
        case ADD_TO_FAVOURITE_REQUEST:
        case FORGET_PASSWORD_REQUEST:
            return { ...state, loading: true, error: null };
        case FORGET_PASSWORD_SUCCESS:
            return { ...state, loading: false, message: action.payload.message, error: null };
        case FORGET_PASSWORD_FAILURE:
            return { ...state, loading: false, error: action.payload, message: null };
        case RESET_PASSWORD_SUCCESS:
            return { ...state, loading: false, message: action.payload, error: null };
        case RESET_PASSWORD_FAILURE:
            return { ...state, loading: false, error: action.payload, message: null };
        case VERIFY_OTP_REQUEST:
            return { ...state, loading: true, error: null };
        case REGISTER_SUCCESS:
            return { ...state, loading: false, accessToken: action.payload, error: null };
        case SEND_OTP_SUCCESS:
            return { ...state, loading: false, otpSent: true, error: null };
        case VERIFY_OTP_SUCCESS:
            return { ...state, loading: false, otpVerified: true, error: null };
        case REGISTER_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case SEND_OTP_FAILURE:
        case VERIFY_OTP_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                accessToken: action.payload,
                success: "Login Success"
            }
        case LOGIN_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }

        case GET_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isLoading: false,
            }
        case LOGOUT:
            return {
                initialState
            }


        default:
            return state;
    }
}