import axios from "axios";
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
} from "./ActionType";
import { API_URL } from "../../api/Api";

export const fetchProducts = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });
    try {
      const response = await axios.get(`${API_URL}/api/product`, {
        params: reqData,
      });
      console.log("fetchProducts response: ", response);
      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: response.data.data });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
    }
  };
};