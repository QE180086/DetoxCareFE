import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { authReducer } from "./Authentication/Reducer";
import {thunk} from "redux-thunk";
import { profileReducer } from "./Profile/Reducer";
import productReducer from "./Product/Reducer";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    product: productReducer,
})
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))