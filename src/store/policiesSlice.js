import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPolicies,
  getPolicyByName,
  createPolicy,
  updatePolicy,
  deletePolicy,
  exportPolicies,
} from "../services/policyService";
import { normalizeError } from "../utils/errorUtils";

// Export thunk for exporting policies data
export const exportPoliciesData = createAsyncThunk(
  "policies/export",
  async (
    {
      format = "csv",
      filters = {},
      sortBy = "name",
      sortDirection = "asc",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      // Call the service function to get the blob
      const blob = await exportPolicies(format, filters, sortBy, sortDirection);

      // Create a download link
      const url = URL.createObjectURL(blob);

      // Determine filename
      const filename = `policies-${
        new Date().toISOString().split("T")[0]
      }.${format}`;

      // Create download element
      const a = document.createElement("a");
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

// Fetch all policies with pagination
export const fetchPolicies = createAsyncThunk(
  "policies/fetchAll",
  async (
    {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "Name",
      filters = {},
      searchTerm = "",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await getPolicies(
        pageNumber,
        pageSize,
        sortBy,
        filters,
        searchTerm
      );

      // If API returns an error response, reject the promise
      if (!response.success) {
        return rejectWithValue(
          normalizeError({
            message:
              response.message ||
              "An error occurred while retrieving policies.",
            errors: response.errors || [],
            statusCode: response.statusCode || 500,
          })
        );
      }

      return {
        policies: response.data?.items || [],
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

// Fetch a single policy by name
export const fetchPolicyByName = createAsyncThunk(
  "policies/fetchByName",
  async (name, { rejectWithValue }) => {
    try {
      const response = await getPolicyByName(name);

      if (!response.success) {
        return rejectWithValue(
          normalizeError({
            message: response.message || "Error retrieving policy.",
            errors: response.errors || [],
            statusCode: response.statusCode || 500,
          })
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

// Create a new policy
export const addPolicy = createAsyncThunk(
  "policies/add",
  async (policyData, { rejectWithValue }) => {
    try {
      const response = await createPolicy(policyData);

      if (!response.success) {
        return rejectWithValue(
          normalizeError({
            message: response.message || "Error creating policy.",
            errors: response.errors || [],
            statusCode: response.statusCode || 500,
            data: response.data,
          })
        );
      }

      return response;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

// Update an existing policy
export const editPolicy = createAsyncThunk(
  "policies/edit",
  async ({ name, policyData }, { rejectWithValue }) => {
    try {
      const response = await updatePolicy(name, policyData);

      if (!response.success) {
        return rejectWithValue(
          normalizeError({
            message: response.message || "Error updating policy.",
            errors: response.errors || [],
            statusCode: response.statusCode || 500,
            data: response.data,
          })
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

// Delete a policy
export const removePolicy = createAsyncThunk(
  "policies/remove",
  async (name, { rejectWithValue }) => {
    try {
      const response = await deletePolicy(name);

      if (!response.success) {
        return rejectWithValue(
          normalizeError({
            message: response.message || "Error deleting policy.",
            errors: response.errors || [],
            statusCode: response.statusCode || 500,
          })
        );
      }

      return name;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

// Slice definition
const policiesSlice = createSlice({
  name: "policies",
  initialState: {
    policies: [],
    loading: false,
    deletingId: null, // Track which policy is being deleted
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
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Policies
      .addCase(fetchPolicies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.loading = false;
        state.policies = action.payload.policies || [];
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Policy by Name
      .addCase(fetchPolicyByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolicyByName.fulfilled, (state, action) => {
        state.loading = false;
        const policy = action.payload;
        const existingIndex = state.policies.findIndex(
          (p) => p.name === policy.name
        );

        if (existingIndex !== -1) {
          state.policies[existingIndex] = policy;
        } else {
          state.policies.push(policy);
        }

        state.error = null;
      })
      .addCase(fetchPolicyByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Policy
      .addCase(addPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPolicy.fulfilled, (state, action) => {
        state.loading = false;

        // Ensure we're accessing the `data` property from the API response
        const newPolicy = action.payload.data || action.payload;

        if (newPolicy) {
          state.policies.push(newPolicy);
        }

        state.error = null;
      })
      .addCase(addPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Policy
      .addCase(editPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPolicy.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPolicy = action.payload;

        const existingIndex = state.policies.findIndex(
          (p) => p.name === updatedPolicy.name
        );
        if (existingIndex !== -1) {
          state.policies[existingIndex] = updatedPolicy;
        }

        state.error = null;
      })
      .addCase(editPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Policy
      .addCase(removePolicy.pending, (state, action) => {
        state.deletingId = action.meta.arg; // Store name of policy being deleted
        state.error = null;
      })
      .addCase(removePolicy.fulfilled, (state, action) => {
        state.deletingId = null;
        state.policies = state.policies.filter(
          (p) => p.name !== action.payload
        );
        state.error = null;
      })
      .addCase(removePolicy.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload;
      })

      // Export Policies
      .addCase(exportPoliciesData.pending, (state) => {
        state.exporting = true;
        state.error = null;
      })
      .addCase(exportPoliciesData.fulfilled, (state) => {
        state.exporting = false;
        state.error = null;
      })
      .addCase(exportPoliciesData.rejected, (state, action) => {
        state.exporting = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = policiesSlice.actions;
export default policiesSlice.reducer;
