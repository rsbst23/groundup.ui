import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getRoles,
    getRoleByName,
    createRole,
    updateRole,
    deleteRole,
    exportRoles
} from "../services/roleService";
import { normalizeError } from "../utils/errorUtils";

// Export thunk for exporting roles data
export const exportRolesData = createAsyncThunk(
    "roles/export",
    async ({ format = 'csv', filters = {}, sortBy = 'name', sortDirection = 'asc' } = {}, { rejectWithValue }) => {
        try {
            // Call the service function to get the blob
            const blob = await exportRoles(format, filters, sortBy, sortDirection);

            // Create a download link
            const url = URL.createObjectURL(blob);

            // Determine filename
            const filename = `roles-${new Date().toISOString().split('T')[0]}.${format}`;

            // Create download element
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

// Fetch all roles with pagination
export const fetchRoles = createAsyncThunk(
    "roles/fetchAll",
    async ({ pageNumber = 1, pageSize = 10, sortBy = "Name", filters = {}, searchTerm = "" } = {}, { rejectWithValue }) => {
        try {
            const response = await getRoles(pageNumber, pageSize, sortBy, filters, searchTerm);

            // If API returns an error response, reject the promise
            if (!response.success) {
                return rejectWithValue(normalizeError({
                    message: response.message || "An error occurred while retrieving roles.",
                    errors: response.errors || [],
                    statusCode: response.statusCode || 500
                }));
            }

            return {
                roles: response.data?.items || [],
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

// Fetch a single role by name
export const fetchRoleByName = createAsyncThunk(
    "roles/fetchByName",
    async (name, { rejectWithValue }) => {
        try {
            const response = await getRoleByName(name);

            if (!response.success) {
                return rejectWithValue(normalizeError({
                    message: response.message || "Error retrieving role.",
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

// Create a new role
export const addRole = createAsyncThunk(
    "roles/add",
    async (roleData, { rejectWithValue }) => {
        try {
            const response = await createRole(roleData);

            if (!response.success) {
                return rejectWithValue(normalizeError({
                    message: response.message || "Error creating role.",
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

// Update an existing role
export const editRole = createAsyncThunk(
    "roles/edit",
    async ({ name, roleData }, { rejectWithValue }) => {
        try {
            const response = await updateRole(name, roleData);

            if (!response.success) {
                return rejectWithValue(normalizeError({
                    message: response.message || "Error updating role.",
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

// Delete a role
export const removeRole = createAsyncThunk(
    "roles/remove",
    async (name, { rejectWithValue }) => {
        try {
            const response = await deleteRole(name);

            if (!response.success) {
                return rejectWithValue(normalizeError({
                    message: response.message || "Error deleting role.",
                    errors: response.errors || [],
                    statusCode: response.statusCode || 500
                }));
            }

            return name;
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

// Slice definition
const rolesSlice = createSlice({
    name: "roles",
    initialState: {
        roles: [],
        loading: false,
        deletingId: null, // Track which role is being deleted
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
            // Fetch Roles
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload.roles || [];
                state.pageNumber = action.payload.pageNumber;
                state.pageSize = action.payload.pageSize;
                state.totalRecords = action.payload.totalRecords;
                state.totalPages = action.payload.totalPages;
                state.error = null;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Role by Name
            .addCase(fetchRoleByName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoleByName.fulfilled, (state, action) => {
                state.loading = false;
                const role = action.payload;
                const existingIndex = state.roles.findIndex((r) => r.name === role.name);

                if (existingIndex !== -1) {
                    state.roles[existingIndex] = role;
                } else {
                    state.roles.push(role);
                }

                state.error = null;
            })
            .addCase(fetchRoleByName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Role
            .addCase(addRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addRole.fulfilled, (state, action) => {
                state.loading = false;

                // Ensure we're accessing the `data` property from the API response
                const newRole = action.payload.data || action.payload;

                if (newRole) {
                    state.roles.push(newRole);
                }

                state.error = null;
            })
            .addCase(addRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Edit Role
            .addCase(editRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editRole.fulfilled, (state, action) => {
                state.loading = false;
                const updatedRole = action.payload;

                const existingIndex = state.roles.findIndex((r) => r.name === updatedRole.name);
                if (existingIndex !== -1) {
                    state.roles[existingIndex] = updatedRole;
                }

                state.error = null;
            })
            .addCase(editRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove Role
            .addCase(removeRole.pending, (state, action) => {
                state.deletingId = action.meta.arg; // Store name of role being deleted
                state.error = null;
            })
            .addCase(removeRole.fulfilled, (state, action) => {
                state.deletingId = null;
                state.roles = state.roles.filter((r) => r.name !== action.payload);
                state.error = null;
            })
            .addCase(removeRole.rejected, (state, action) => {
                state.deletingId = null;
                state.error = action.payload;
            })

            // Export Roles
            .addCase(exportRolesData.pending, (state) => {
                state.exporting = true;
                state.error = null;
            })
            .addCase(exportRolesData.fulfilled, (state) => {
                state.exporting = false;
                state.error = null;
            })
            .addCase(exportRolesData.rejected, (state, action) => {
                state.exporting = false;
                state.error = action.payload;
            })
    },
});

export const { clearErrors } = rolesSlice.actions;
export default rolesSlice.reducer;