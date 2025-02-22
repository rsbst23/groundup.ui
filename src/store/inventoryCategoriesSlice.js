import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getInventoryCategories,
    createInventoryCategory,
    updateInventoryCategory,
    deleteInventoryCategory,
} from "../services/inventoryCategoryService";

// Fetch all categories with pagination
export const fetchInventoryCategories = createAsyncThunk(
    "inventoryCategories/fetchAll",
    async ({ pageNumber = 1, pageSize = 10, sortBy = "Id", filters = {}, searchTerm = "" } = {}, { rejectWithValue }) => {
        try {
            const response = await getInventoryCategories(pageNumber, pageSize, sortBy, filters, searchTerm);

            // If API returns an error response, reject the promise
            if (!response.success) {
                return rejectWithValue({
                    message: response.message || "An error occurred while retrieving data.",
                    errors: response.errors || [],
                });
            }

            return {
                categories: response.data?.items || [],
                pageNumber: response.data?.pageNumber || 1,
                pageSize: response.data?.pageSize || 10,
                totalRecords: response.data?.totalRecords || 0,
                totalPages: response.data?.totalPages || 1,
            };
        } catch (error) {
            console.error("fetchInventoryCategories - Error:", error);
            return rejectWithValue({
                message: "A network or unexpected error occurred.",
                errors: [error.message || "Unknown error"],
            });
        }
    }
);

// Add a new category
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

// Edit an existing category
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

// Slice definition
const inventoryCategoriesSlice = createSlice({
    name: "inventoryCategories",
    initialState: {
        categories: [],
        loading: false,
        deletingId: null, // Track which category is being deleted
        error: null,
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0,
        totalPages: 1,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Categories
            .addCase(fetchInventoryCategories.pending, (state) => {
                if (!state.loading) { // Prevent multiple pending states triggering another fetch
                    state.loading = true;
                    state.error = null;
                }
            })
            .addCase(fetchInventoryCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories || [];
                state.pageNumber = action.payload.pageNumber;
                state.pageSize = action.payload.pageSize;
                state.totalRecords = action.payload.totalRecords;
                state.totalPages = action.payload.totalPages;
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
                const index = state.categories.findIndex((c) => c.id === action.payload.id);
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
                state.categories = state.categories.filter((c) => c.id !== action.payload);
            })
            .addCase(removeInventoryCategory.rejected, (state, action) => {
                state.deletingId = null;
                state.error = action.payload;
            });
    },
});

export default inventoryCategoriesSlice.reducer;
