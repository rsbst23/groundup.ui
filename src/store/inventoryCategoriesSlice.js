import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getInventoryCategories,
    getInventoryCategoryById,
    createInventoryCategory,
    updateInventoryCategory,
    deleteInventoryCategory,
} from "../services/inventoryCategoryService";
import { normalizeError } from "../utils/errorUtils";

// Fetch all categories with pagination
export const fetchInventoryCategories = createAsyncThunk(
    "inventoryCategories/fetchAll",
    async ({ pageNumber = 1, pageSize = 10, sortBy = "Id", filters = {}, searchTerm = "" } = {}, { rejectWithValue }) => {
        try {
            const response = await getInventoryCategories(pageNumber, pageSize, sortBy, filters, searchTerm);

            // If API returns an error response, reject the promise
            if (!response.success) {
                return rejectWithValue(normalizeError({
                    message: response.message || "An error occurred while retrieving data.",
                    errors: response.errors || [],
                    statusCode: response.statusCode || 500
                }));
            }

            return {
                categories: response.data?.items || [],
                pageNumber: response.data?.pageNumber || 1,
                pageSize: response.data?.pageSize || 10,
                totalRecords: response.data?.totalRecords || 0,
                totalPages: response.data?.totalPages || 1,
            };
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

// Fetch a single category by ID
export const fetchInventoryCategoryById = createAsyncThunk(
    "inventoryCategories/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getInventoryCategoryById(id);

            if (!response.success) {
                return rejectWithValue(normalizeError({
                    message: response.message || "Error retrieving category.",
                    errors: response.errors || [],
                    statusCode: response.statusCode || 500
                }));
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

// Add a new category
export const addInventoryCategory = createAsyncThunk(
    "inventoryCategories/add",
    async (category, { rejectWithValue }) => {
        try {
            const response = await createInventoryCategory(category);

            if (!response.success) {
                return rejectWithValue(normalizeError({
                    message: response.message || "Error creating category.",
                    errors: response.errors || [],
                    statusCode: response.statusCode || 500,
                    data: response.data
                }));
            }

            return response;
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

// Edit an existing category
export const editInventoryCategory = createAsyncThunk(
    "inventoryCategories/edit",
    async (categoryData, { rejectWithValue }) => {
        try {
            const { id, ...data } = categoryData;
            const response = await updateInventoryCategory(id, data);

            if (!response.success) {
                return rejectWithValue(normalizeError({
                    message: response.message || "Error updating category.",
                    errors: response.errors || [],
                    statusCode: response.statusCode || 500,
                    data: response.data
                }));
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

// Delete a category
export const removeInventoryCategory = createAsyncThunk(
    "inventoryCategories/remove",
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteInventoryCategory(id);

            if (!response.success) {
                return rejectWithValue(normalizeError({
                    message: response.message || "Error deleting category.",
                    errors: response.errors || [],
                    statusCode: response.statusCode || 500
                }));
            }

            return id;
        } catch (error) {
            return rejectWithValue(normalizeError(error));
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
    reducers: {
        // Add a reducer to clear errors
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Categories
            .addCase(fetchInventoryCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInventoryCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories || [];
                state.pageNumber = action.payload.pageNumber;
                state.pageSize = action.payload.pageSize;
                state.totalRecords = action.payload.totalRecords;
                state.totalPages = action.payload.totalPages;
                state.error = null;
            })
            .addCase(fetchInventoryCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Category by ID
            .addCase(fetchInventoryCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInventoryCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                const category = action.payload;
                const existingIndex = state.categories.findIndex((c) => c.id === category.id);

                if (existingIndex !== -1) {
                    state.categories[existingIndex] = category;
                } else {
                    state.categories.push(category);
                }

                state.error = null;
            })
            .addCase(fetchInventoryCategoryById.rejected, (state, action) => {
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

                // Ensure we're accessing the `data` property from the API response
                const newCategory = action.payload.data || action.payload;

                if (newCategory && newCategory.id) {
                    state.categories.push(newCategory);
                }

                state.error = null;
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
                const updatedCategory = action.payload;

                const existingIndex = state.categories.findIndex((c) => c.id === updatedCategory.id);
                if (existingIndex !== -1) {
                    state.categories[existingIndex] = updatedCategory;
                }

                state.error = null;
            })
            .addCase(editInventoryCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove Category
            .addCase(removeInventoryCategory.pending, (state, action) => {
                state.deletingId = action.meta.arg; // Store ID of category being deleted
                state.error = null;
            })
            .addCase(removeInventoryCategory.fulfilled, (state, action) => {
                state.deletingId = null;
                state.categories = state.categories.filter((c) => c.id !== action.payload);
                state.error = null;
            })
            .addCase(removeInventoryCategory.rejected, (state, action) => {
                state.deletingId = null;
                state.error = action.payload;
            });
    },
});

export const { clearErrors } = inventoryCategoriesSlice.actions;
export default inventoryCategoriesSlice.reducer;