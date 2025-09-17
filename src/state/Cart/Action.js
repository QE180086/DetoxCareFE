import {
  ADD_TO_CART,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_FAILURE,
  REMOVE_FROM_CART,
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
  CLEAR_CART,
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  UPDATE_QUANTITY_REQUEST,
  UPDATE_QUANTITY_FAILURE,
  DELETE_CART_ITEM_REQUEST,
  DELETE_CART_ITEM_FAILURE,
  UPDATE_QUANTITY_SUCCESS,
  DELETE_CART_ITEM_SUCCESS,
} from "./ActionType";
import { cartItemApi } from "../../utils/api/cart-item.api.js";

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

export const removeFromCart = (id) => ({
  type: REMOVE_FROM_CART,
  payload: id,
});

export const increaseQuantity = (id) => ({
  type: INCREASE_QUANTITY,
  payload: id,
});

export const decreaseQuantity = (id) => ({
  type: DECREASE_QUANTITY,
  payload: id,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});

// API Actions
export const increaseQuantityFromServer = (itemId, quantity) => async (dispatch, getState) => {
  const { auth } = getState();
  
  // Check if user is authenticated
  if (!auth?.accessToken) {
    console.log("User not authenticated, cannot update cart item quantity on server");
    // Fallback to local cart action
    dispatch(increaseQuantity(itemId));
    return;
  }

  dispatch({ type: UPDATE_QUANTITY_REQUEST });
  
  try {
    // Prepare cart item data
    const cartItemData = {
      cartItemId: itemId,
      quantity: quantity
    };
    
    // Call the API to update item quantity in cart
    const response = await cartItemApi.updateQuantityCart(cartItemData, auth.accessToken);
    
    // After successfully updating quantity, fetch the updated cart
    dispatch(fetchCartFromServer());
    
    dispatch({
      type: UPDATE_QUANTITY_SUCCESS,
    });
    
    return response;
  } catch (error) {
    console.error("Failed to update item quantity in cart on server:", error);
    
    let errorMessage = "Failed to update item quantity in cart";
    if (error.response?.data?.message) {
      if (typeof error.response.data.message === 'object') {
        if (error.response.data.message.messageDetail) {
          errorMessage = error.response.data.message.messageDetail;
        } else {
          errorMessage = JSON.stringify(error.response.data.message);
        }
      } else {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    dispatch({
      type: UPDATE_QUANTITY_FAILURE,
      payload: errorMessage,
    });
    
    throw error;
  }
};

export const decreaseQuantityFromServer = (itemId, quantity) => async (dispatch, getState) => {
  const { auth } = getState();
  
  // Check if user is authenticated
  if (!auth?.accessToken) {
    console.log("User not authenticated, cannot update cart item quantity on server");
    // Fallback to local cart action
    dispatch(decreaseQuantity(itemId));
    return;
  }

  dispatch({ type: UPDATE_QUANTITY_REQUEST });
  
  try {
    // Prepare cart item data
    const cartItemData = {
      cartItemId: itemId,
      quantity: quantity
    };
    
    // Call the API to update item quantity in cart
    const response = await cartItemApi.updateQuantityCart(cartItemData, auth.accessToken);
    
    // After successfully updating quantity, fetch the updated cart
    dispatch(fetchCartFromServer());
    
    dispatch({
      type: UPDATE_QUANTITY_SUCCESS,
    });
    
    return response;
  } catch (error) {
    console.error("Failed to update item quantity in cart on server:", error);
    
    let errorMessage = "Failed to update item quantity in cart";
    if (error.response?.data?.message) {
      if (typeof error.response.data.message === 'object') {
        if (error.response.data.message.messageDetail) {
          errorMessage = error.response.data.message.messageDetail;
        } else {
          errorMessage = JSON.stringify(error.response.data.message);
        }
      } else {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    dispatch({
      type: UPDATE_QUANTITY_FAILURE,
      payload: errorMessage,
    });
    
    throw error;
  }
};

export const addToCartFromServer = (product) => async (dispatch, getState) => {
  const { auth } = getState();
  
  // Check if user is authenticated
  if (!auth?.accessToken) {
    console.log("User not authenticated, cannot add to cart on server");
    // Fallback to local cart action
    dispatch(addToCart(product));
    return;
  }

  dispatch({ type: ADD_TO_CART_REQUEST });
  
  try {
    // Prepare cart item data
    const cartItemData = {
      productId: product.id,
      quantity: 1
    };
    
    // Call the API to add item to cart
    const response = await cartItemApi.addToCart(cartItemData, auth.accessToken);
    
    // After successfully adding to server, fetch the updated cart
    dispatch(fetchCartFromServer());
    
    return response;
  } catch (error) {
    console.error("Failed to add item to cart on server:", error);
    
    let errorMessage = "Failed to add item to cart";
    if (error.response?.data?.message) {
      if (typeof error.response.data.message === 'object') {
        if (error.response.data.message.messageDetail) {
          errorMessage = error.response.data.message.messageDetail;
        } else {
          errorMessage = JSON.stringify(error.response.data.message);
        }
      } else {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    dispatch({
      type: ADD_TO_CART_FAILURE,
      payload: errorMessage,
    });
    
    throw error;
  }
};

export const deleteCartItemFromServer = (cartItemId) => async (dispatch, getState) => {
  const { auth } = getState();
  
  
  // Check if user is authenticated
  if (!auth?.accessToken) {
    console.log("User not authenticated, cannot delete cart item on server");
    // Fallback to local cart action
    dispatch(removeFromCart(cartItemId));
    return;
  }

  dispatch({ type: DELETE_CART_ITEM_REQUEST });
  
  try {
    console.log("Calling API to delete cart item with ID:", cartItemId);
    // Call the API to delete item from cart
    const response = await cartItemApi.delete(cartItemId, auth.accessToken);
    console.log("API response for delete:", response);
    
    // After successfully deleting, fetch the updated cart
    dispatch(fetchCartFromServer());
    
    dispatch({
      type: DELETE_CART_ITEM_SUCCESS,
    });
    
    return response;
  } catch (error) {
    console.error("Failed to delete cart item on server:", error);
    
    let errorMessage = "Failed to delete cart item";
    if (error.response?.data?.message) {
      if (typeof error.response.data.message === 'object') {
        if (error.response.data.message.messageDetail) {
          errorMessage = error.response.data.message.messageDetail;
        } else {
          errorMessage = JSON.stringify(error.response.data.message);
        }
      } else {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    dispatch({
      type: DELETE_CART_ITEM_FAILURE,
      payload: errorMessage,
    });
    
    throw error;
  }
};

export const deleteAllFromServer = () => async (dispatch, getState) => {
  const { auth } = getState();
  
  // Check if user is authenticated
  if (!auth?.accessToken) {
    console.log("User not authenticated, cannot delete all cart items on server");
    // Fallback to local cart action
    dispatch(clearCart());
    return;
  }

  dispatch({ type: DELETE_CART_ITEM_REQUEST });
  
  try {
    // Call the API to delete all items from cart
    const response = await cartItemApi.deleteAll(auth.accessToken);
    
    // After successfully deleting all items, clear the local cart
    dispatch(clearCart());
    
    return response;
  } catch (error) {
    console.error("Failed to delete all cart items on server:", error);
    
    let errorMessage = "Failed to delete all cart items";
    if (error.response?.data?.message) {
      if (typeof error.response.data.message === 'object') {
        if (error.response.data.message.messageDetail) {
          errorMessage = error.response.data.message.messageDetail;
        } else {
          errorMessage = JSON.stringify(error.response.data.message);
        }
      } else {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    dispatch({
      type: DELETE_CART_ITEM_FAILURE,
      payload: errorMessage,
    });
    
    throw error;
  }
};

export const fetchCartFromServer = () => async (dispatch, getState) => {
  const { auth } = getState(); // Changed from 'authentication' to 'auth'

  // Only fetch if user is authenticated
  if (!auth?.accessToken) {
    console.log("User not authenticated, skipping cart fetch");
    // Clear local cart items when user is not authenticated
    dispatch({
      type: FETCH_CART_SUCCESS,
      payload: [],
    });
    return;
  }

  console.log("User authenticated, fetching cart with token:", auth.accessToken.substring(0, 10) + "...");

  dispatch({ type: FETCH_CART_REQUEST });
  
  try {
    const response = await cartItemApi.getAll(1, 8, "createdDate", "desc", auth.accessToken);
    console.log("Cart fetch successful, full response:", response);
    
    // Extract the content array from the response
    const cartItems = response.data?.content || response.data || [];
    
    dispatch({
      type: FETCH_CART_SUCCESS,
      payload: cartItems,
    });
  } catch (error) {
    // Extract error message properly to avoid passing objects
    let errorMessage = "Failed to fetch cart items";
    
    // Handle the specific error you're seeing
    if (error.response?.data?.message) {
      if (typeof error.response.data.message === 'object') {
        if (error.response.data.message.messageDetail) {
          errorMessage = error.response.data.message.messageDetail;
        } else if (error.response.data.message.messageCode) {
          errorMessage = `Error code: ${error.response.data.message.messageCode} - ${error.response.data.message.messageDetail || 'Unknown error'}`;
        } else {
          errorMessage = JSON.stringify(error.response.data.message);
        }
      } else {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Special handling for the specific error you're encountering
    if (errorMessage.includes("Query did not return a unique result")) {
      errorMessage = "There's an issue with your cart data. Please contact support for assistance.";
    }
    
    dispatch({
      type: FETCH_CART_FAILURE,
      payload: errorMessage,
    });
  }
};