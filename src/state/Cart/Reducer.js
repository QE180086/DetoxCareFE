import {
  ADD_TO_CART,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_FAILURE,
  REMOVE_FROM_CART,
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
  UPDATE_QUANTITY_REQUEST,
  UPDATE_QUANTITY_SUCCESS,
  UPDATE_QUANTITY_FAILURE,
  CLEAR_CART,
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  DELETE_CART_ITEM_REQUEST,
  DELETE_CART_ITEM_FAILURE
} from "./ActionType";

const initialState = {
  cartItems: [],
  isLoading: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART_REQUEST:
    case UPDATE_QUANTITY_REQUEST:
    case DELETE_CART_ITEM_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case ADD_TO_CART: {
      // Transform the product data to match the cart item structure
      const cartItem = {
        id: action.payload.id,
        productId: action.payload.id,
        productName: action.payload.name,
        productImage: action.payload.image,
        unitPrice: action.payload.price,
        price: action.payload.price, // Keep both for compatibility
        quantity: 1
      };
      
      const existingItem = state.cartItems.find(
        (item) => item.productId === cartItem.productId
      );
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.productId === cartItem.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, cartItem],
        };
      }
    }
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };
    case INCREASE_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    case DECREASE_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.flatMap((item) => {
          if (item.id === action.payload) {
            if (item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              return [];
            }
          }
          return item;
        }),
      };
    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      };
    case ADD_TO_CART_FAILURE:
    case UPDATE_QUANTITY_FAILURE:
    case DELETE_CART_ITEM_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: typeof action.payload === 'string' ? action.payload : JSON.stringify(action.payload),
      };
    case UPDATE_QUANTITY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case FETCH_CART_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_CART_SUCCESS:
      // Ensure payload is an array and transform items to match expected structure
      const transformedItems = Array.isArray(action.payload) 
        ? action.payload.map(item => ({
            id: item.id,
            productId: item.productId,
            name: item.productName,
            image: item.productImage,
            price: item.unitPrice,
            quantity: item.quantity
          }))
        : [];
        
      return {
        ...state,
        isLoading: false,
        cartItems: transformedItems,
        error: null,
      };
    case FETCH_CART_FAILURE:
      // Ensure error is a string
      return {
        ...state,
        isLoading: false,
        error: typeof action.payload === 'string' ? action.payload : JSON.stringify(action.payload),
      };
    default:
      return state;
  }
};

export default cartReducer;