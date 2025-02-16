import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./exampleSlice.js"; // Import slice

export const store = configureStore({
  reducer: {
    example: exampleReducer, // Add the reducer to the store
  },
});

export default store;
