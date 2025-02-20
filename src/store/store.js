import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./booksSlice";
import inventoryCategoriesReducer from "./inventoryCategoriesSlice";

export const store = configureStore({
  reducer: {
        books: booksReducer,
        inventoryCategories: inventoryCategoriesReducer
  },
});
