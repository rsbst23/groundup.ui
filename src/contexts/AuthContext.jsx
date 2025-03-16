import React, { createContext, useState, useEffect, useContext } from 'react';
import keycloakService from '../services/keycloakService';

// Create context
const AuthContext = createContext();

// Create provider
export const AuthProvider = ({ children }) => {
    const [initialized, setInitialized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize Keycloak on component mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                setLoading(true);
                // Initialize Keycloak but don't force login
                const isAuthenticated = await keycloakService.initKeycloak();
                setAuthenticated(isAuthenticated);

                if (isAuthenticated) {
                    const userInfo = keycloakService.getUserInfo();
                    setUser(userInfo);
                }

                setInitialized(true);
                setError(null);
            } catch (err) {
                console.error('Failed to initialize authentication:', err);
                setError('Failed to initialize authentication');
                setAuthenticated(false);
                setUser(null);

                // Even if initialization fails, mark as initialized
                // so the app can still render public pages
                setInitialized(true);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Login function - only called explicitly when needed
    const login = (redirectUri) => {
        keycloakService.login(redirectUri);
    };

    // Logout function
    const logout = (redirectUri) => {
        keycloakService.logout(redirectUri);
    };

    // Check if user has a specific permission
    const hasPermission = (permission) => {
        if (!authenticated || !user) return false;

        // Check if user has admin role
        if (user.roles.includes('admin')) return true;

        // Check for specific role/permission
        return user.roles.includes(permission);
    };

    // Handle unauthorized errors from API
    const handleUnauthorized = () => {
        // Force refresh token, if that fails Keycloak will redirect to login
        keycloakService.updateToken(0).catch(() => {
            // Token refresh failed, Keycloak will handle redirection
            console.log('Session expired, redirecting to login');
        });
    };

    const value = {
        initialized,
        user,
        loading,
        error,
        login,
        logout,
        hasPermission,
        handleUnauthorized,
        isAuthenticated: authenticated,
        keycloak: keycloakService.keycloak, // Expose Keycloak instance if needed
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;