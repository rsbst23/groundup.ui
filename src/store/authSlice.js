import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Placeholder thunks during transition to Keycloak
export const loginUser = createAsyncThunk(
    "auth/login",
    async () => {
        console.warn('Redux login action is being transitioned to Keycloak');
        return {
            user: {
                id: 'placeholder',
                name: 'Temporary User',
                email: 'placeholder@example.com',
                roles: ['Admin']
            }
        };
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async () => {
        console.warn('Redux logout action is being transitioned to Keycloak');
        return {};
    }
);

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState: {
        // Always authenticated during transition
        user: {
            id: 'placeholder',
            name: 'Temporary User',
            email: 'placeholder@example.com',
            roles: ['Admin']
        },
        isAuthenticated: true,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Login failed";
            })
            .addCase(logoutUser.fulfilled, (state) => {
                // During transition, stay authenticated
                state.isAuthenticated = true;
            });
    },
});

export default authSlice.reducer;