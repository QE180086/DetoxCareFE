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
  SET_DEFAULT_ADDRESS_FAILURE
} from "./ActionType";

import axios from "axios";
import { API_URL } from "../../api/Api";

// Lấy tất cả profiles
export const getAllProfiles = (jwt) => async (dispatch) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  try {
    const { data } = await axios.get(`${API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: GET_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    const message = error?.response?.data?.message?.messageDetail || 'Không thể lấy danh sách hồ sơ';
    dispatch({ type: GET_PROFILE_FAILURE, payload: message });
  }
};

// Lấy profile theo userId
export const getProfileByUserId = (userId, jwt) => async (dispatch) => {
  dispatch({ type: GET_PROFILE_BY_USERID_REQUEST });
  try {
    const { data } = await axios.get(`${API_URL}/api/profile/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: GET_PROFILE_BY_USERID_SUCCESS, payload: data });
  } catch (error) {
    const message = error?.response?.data?.message?.messageDetail || 'Không thể lấy hồ sơ người dùng';
    dispatch({ type: GET_PROFILE_BY_USERID_FAILURE, payload: message });
  }
};

// Cập nhật profile
export const updateProfile = (profileData, jwt) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const { data } = await axios.put(`${API_URL}/api/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    const message = error?.response?.data?.message?.messageDetail || 'Cập nhật hồ sơ thất bại';
    dispatch({ type: UPDATE_PROFILE_FAILURE, payload: message });
  }
};

// Gán địa chỉ mặc định
export const setDefaultAddress = (addressId, jwt) => async (dispatch) => {
  dispatch({ type: SET_DEFAULT_ADDRESS_REQUEST });
  try {
    const { data } = await axios.put(`${API_URL}/api/profile/address-default/${addressId}`, {}, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: SET_DEFAULT_ADDRESS_SUCCESS, payload: data });
  } catch (error) {
    const message = error?.response?.data?.message?.messageDetail || 'Gán địa chỉ mặc định thất bại';
    dispatch({ type: SET_DEFAULT_ADDRESS_FAILURE, payload: message });
  }
};
