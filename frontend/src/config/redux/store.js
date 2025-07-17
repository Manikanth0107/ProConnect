import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

/**
 *
 *
 * Steps for state management
 * Submit Action
 * Handle action in its reducer
 * Register here --> reducer
 *
 */

export const store = configureStore({
  reducer: {
    auth: authReducer,
    postReducer: postReducer,
  },
});
