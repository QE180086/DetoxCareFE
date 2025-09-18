import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  GET_PROFILE_BY_USERID_REQUEST,
  GET_PROFILE_BY_USERID_SUCCESS,
  GET_PROFILE_BY_USERID_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  SET_DEFAULT_ADDRESS_REQUEST,
  SET_DEFAULT_ADDRESS_SUCCESS,
  SET_DEFAULT_ADDRESS_FAILURE,
  CLEAR_PROFILE_ERROR
} from "./ActionType";

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
  message: null,
};

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE_REQUEST:
    case GET_PROFILE_BY_USERID_REQUEST:
    case UPDATE_PROFILE_REQUEST:
    case SET_DEFAULT_ADDRESS_REQUEST:
      return { ...state, isLoading: true, error: null, message: null };

    case GET_PROFILE_SUCCESS:
    case GET_PROFILE_BY_USERID_SUCCESS:
      return { ...state, isLoading: false, profile: action.payload, error: null };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        profile: action.payload,
        message: "Cập nhật hồ sơ thành công",
        error: null,
      };

    case SET_DEFAULT_ADDRESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        profile: {
          ...state.profile,
          defaultAddressId: action.payload?.defaultAddressId || null,
        },
        message: "Đã đặt địa chỉ mặc định",
        error: null,
      };

    case GET_PROFILE_FAILURE:
    case GET_PROFILE_BY_USERID_FAILURE:
    case UPDATE_PROFILE_FAILURE:
    case SET_DEFAULT_ADDRESS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        message: null,
      };
    
    case CLEAR_PROFILE_ERROR:
      return {
        ...state,
        error: null,
        message: null,
      };

    default:
      return state;
  }
};
