import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./booksSlice";
import inventoryCategoriesReducer from "./inventoryCategoriesSlice";
import rolesReducer from "./rolesSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
        auth: authReducer,
        books: booksReducer,
        inventoryCategories: inventoryCategoriesReducer,
        roles: rolesReducer
  },
});
