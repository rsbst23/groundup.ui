import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getInventoryCategories,
    createInventoryCategory,
    updateInventoryCategory,
    deleteInventoryCategory,
} from "../services/inventoryCategoryService";

// Async Thunks with Error Handling

// Fetch all categories
export const fetchInventoryCategories = createAsyncThunk(
    "inventoryCategories/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await getInventoryCategories();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add a category
export const addInventoryCategory = createAsyncThunk(
    "inventoryCategories/add",
    async (category, { rejectWithValue }) => {
        try {
            return await createInventoryCategory(category);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Edit a category
export const editInventoryCategory = createAsyncThunk(
    "inventoryCategories/edit",
    async ({ id, name }, { rejectWithValue }) => {
        try {
            return await updateInventoryCategory(id, { id, name });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete a category
export const removeInventoryCategory = createAsyncThunk(
    "inventoryCategories/remove",
    async (id, { rejectWithValue }) => {
        try {
            await deleteInventoryCategory(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice
const inventoryCategoriesSlice = createSlice({
    name: "inventoryCategories",
    initialState: {
        categories: [],
        loading: false,
        deletingId: null, // Track which category is being deleted
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Categories
            .addCase(fetchInventoryCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInventoryCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchInventoryCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Category
            .addCase(addInventoryCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addInventoryCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(addInventoryCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Edit Category
            .addCase(editInventoryCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editInventoryCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex(
                    (c) => c.id === action.payload.id
                );
                if (index !== -1) state.categories[index] = action.payload;
            })
            .addCase(editInventoryCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove Category
            .addCase(removeInventoryCategory.pending, (state, action) => {
                state.deletingId = action.meta.arg; // Store ID of category being deleted
            })
            .addCase(removeInventoryCategory.fulfilled, (state, action) => {
                state.deletingId = null;
                state.categories = state.categories.filter(
                    (c) => c.id !== action.payload
                );
            })
            .addCase(removeInventoryCategory.rejected, (state, action) => {
                state.deletingId = null;
                state.error = action.payload;
            });
    },
});

export default inventoryCategoriesSlice.reducer;
