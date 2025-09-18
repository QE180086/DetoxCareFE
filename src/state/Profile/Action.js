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

import { profileApi } from "../../utils/api/profile.api";

// Lấy tất cả profiles
export const getAllProfiles = (jwt) => async (dispatch) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  try {
    const data = await profileApi.getProfile(jwt);
    dispatch({ type: GET_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    const message = error?.response?.data?.message?.messageDetail || 'Không thể lấy danh sách hồ sơ';
    dispatch({ type: GET_PROFILE_FAILURE, payload: message });
  }
};

// Lấy profile theo userId
export const getProfileByUserId = (userId, accessToken) => async (dispatch) => {
  dispatch({ type: GET_PROFILE_BY_USERID_REQUEST });
  try {
    const data = await profileApi.getUserById(userId, accessToken);
    dispatch({ type: GET_PROFILE_BY_USERID_SUCCESS, payload: data });
  } catch (error) {
    const message = error?.response?.data?.message?.messageDetail || 'Không thể lấy hồ sơ người dùng';
    dispatch({ type: GET_PROFILE_BY_USERID_FAILURE, payload: message });
    throw error; // Re-throw the error so it can be caught by the component
  }
};

// Cập nhật profile
export const updateProfile = (profileData, accessToken) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const data = await profileApi.updateProfile(profileData, accessToken);
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    const message = error?.response?.data?.message?.messageDetail || 'Cập nhật hồ sơ thất bại';
    dispatch({ type: UPDATE_PROFILE_FAILURE, payload: message });
    throw error; // Re-throw the error so it can be caught by the component
  }
};

// Gán địa chỉ mặc định
export const setDefaultAddress = (addressId, jwt) => async (dispatch) => {
  dispatch({ type: SET_DEFAULT_ADDRESS_REQUEST });
  try {
    const data = await profileApi.setDefaultAddress(addressId);
    dispatch({ type: SET_DEFAULT_ADDRESS_SUCCESS, payload: data });
  } catch (error) {
    const message = error?.response?.data?.message?.messageDetail || 'Gán địa chỉ mặc định thất bại';
    dispatch({ type: SET_DEFAULT_ADDRESS_FAILURE, payload: message });
  }
};

// Clear profile errors
export const clearProfileError = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE_ERROR });
};
