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
  DELETE_CART_ITEM_SUCCESS,
  DELETE_CART_ITEM_FAILURE
} from "./ActionType";

const initialState = {
  cartItems: [],
  isLoading: false,
  error: null,
};

// Helper function to save guest cart to sessionStorage
const saveGuestCartToSessionStorage = (cartItems) => {
  try {
    // Only save to sessionStorage if user is not authenticated
    // We can check this by looking for accessToken in sessionStorage
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  } catch (error) {
    console.error('Failed to save guest cart to sessionStorage:', error);
  }
};

const cartReducer = (state = initialState, action) => {
  let newState;
  
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
        id: action.payload.id || action.payload.productId,
        productId: action.payload.productId || action.payload.id,
        name: action.payload.name || action.payload.productName || "Sản phẩm",
        image: action.payload.image || action.payload.productImage || "https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg",
        price: action.payload.price || action.payload.unitPrice || 0,
        unitPrice: action.payload.unitPrice || action.payload.price || 0,
        quantity: 1
      };
      
      const existingItem = state.cartItems.find(
        (item) => item.productId === cartItem.productId
      );
      if (existingItem) {
        newState = {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.productId === cartItem.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        newState = {
          ...state,
          cartItems: [...state.cartItems, cartItem],
        };
      }
      
      // Save guest cart to sessionStorage
      saveGuestCartToSessionStorage(newState.cartItems);
      return newState;
    }
    case REMOVE_FROM_CART: {
      newState = {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };
      
      // Save guest cart to sessionStorage
      saveGuestCartToSessionStorage(newState.cartItems);
      return newState;
    }
    case INCREASE_QUANTITY: {
      newState = {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
      
      // Save guest cart to sessionStorage
      saveGuestCartToSessionStorage(newState.cartItems);
      return newState;
    }
    case DECREASE_QUANTITY: {
      newState = {
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
      
      // Save guest cart to sessionStorage
      saveGuestCartToSessionStorage(newState.cartItems);
      return newState;
    }
    case CLEAR_CART: {
      newState = {
        ...state,
        cartItems: [],
      };
      
      // Save guest cart to sessionStorage
      saveGuestCartToSessionStorage(newState.cartItems);
      return newState;
    }
    case ADD_TO_CART_FAILURE:
    case UPDATE_QUANTITY_FAILURE:
    case DELETE_CART_ITEM_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: typeof action.payload === 'string' ? action.payload : JSON.stringify(action.payload),
      };
    case UPDATE_QUANTITY_SUCCESS:
    case DELETE_CART_ITEM_SUCCESS:
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
            name: item.productName || item.name,      // Handle both property names
            image: item.productImage || item.image,   // Handle both property names
            price: item.unitPrice || item.price,      // Handle both property names
            quantity: item.quantity
          }))
        : [];
        
      newState = {
        ...state,
        isLoading: false,
        cartItems: transformedItems,
        error: null,
      };
      
      // Save guest cart to sessionStorage (will only save if user is not authenticated)
      saveGuestCartToSessionStorage(newState.cartItems);
      return newState;
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