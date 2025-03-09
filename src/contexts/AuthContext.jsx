import { createContext, useContext, useEffect, useState, useCallback } from "react";
import apiService from "../services/apiService";

// Create context outside the component to ensure it's stable
const AuthContext = createContext(null);

// AuthProvider with stable context and better state management
export const AuthProvider = ({ children }) => {
    // Use a more complete state object instead of separate variables
    const [authState, setAuthState] = useState({
        user: null,
        loading: true,
        initialized: false
    });

    // Update auth state in a single place
    const updateAuthState = useCallback((newState) => {
        setAuthState(prev => ({ ...prev, ...newState }));
    }, []);

    // Initial fetch of user data
    useEffect(() => {
        if (authState.initialized) return;

        const fetchUser = async () => {
            try {
                const response = await apiService.get("/auth/me");

                if (response.success) {
                    updateAuthState({
                        user: response.data,
                        loading: false,
                        initialized: true
                    });
                } else {
                    updateAuthState({
                        user: null,
                        loading: false,
                        initialized: true
                    });
                }
            } catch (error) {
                console.error("[AuthProvider] Error fetching initial user:", error);
                updateAuthState({
                    user: null,
                    loading: false,
                    initialized: true
                });
            }
        };

        fetchUser();
    }, [updateAuthState, authState.initialized]);

    // Login handler
    const login = async (credentials) => {
        updateAuthState({ loading: true });

        try {
            // Step 1: Login
            const loginResponse = await apiService.post("/auth/login", credentials);

            if (!loginResponse.success) {
                updateAuthState({ loading: false });
                return { success: false, message: loginResponse.message || "Login failed" };
            }

            // Step 2: Get user data
            const userData = await apiService.get("/auth/me");

            if (userData.success) {
                // Important: Update state in a single operation
                updateAuthState({
                    user: userData.data,
                    loading: false
                });
                return { success: true };
            } else {
                updateAuthState({ loading: false });
                return { success: false, message: "Failed to get user details" };
            }
        } catch (error) {
            updateAuthState({ loading: false });
            return { success: false, message: error.message || "Login failed" };
        }
    };

    // Logout handler
    const logout = async () => {
        updateAuthState({ loading: true });

        try {
            await apiService.post("/auth/logout");

            updateAuthState({
                user: null,
                loading: false
            });

            return { success: true };
        } catch (error) {
            updateAuthState({ loading: false });
            return { success: false, message: error.message };
        }
    };

    // Debug - log state changes
    useEffect(() => {
    }, [authState]);

    // Prepare value object once to avoid unnecessary re-renders
    const contextValue = {
        user: authState.user,
        loading: authState.loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook with error checking
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        console.error("[useAuth] Auth context is null! Did you forget to wrap your app with AuthProvider?");
        // Return a default value to prevent crashes
        return { user: null, loading: false, login: () => { }, logout: () => { } };
    }
    return context;
};