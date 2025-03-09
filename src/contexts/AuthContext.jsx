import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

// Create context
const AuthContext = createContext();

// Create provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Function to load the user's information
    const loadUser = async () => {
        try {
            setLoading(true);
            const response = await authService.getUser();

            if (response.success && response.data) {
                setUser(response.data);
            } else {
                // Clear user if response was not successful
                setUser(null);
            }

            setError(null);
        } catch (err) {
            console.error('Failed to load user:', err);
            setUser(null);
            setError(err.message || 'Failed to authenticate');
        } finally {
            setLoading(false);
        }
    };

    // Load user on initial mount
    useEffect(() => {
        loadUser();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.login(credentials);

            if (response.success) {
                await loadUser();
                return true;
            } else {
                setError(response.message || 'Login failed');
                return false;
            }
        } catch (err) {
            setError(err.message || 'Login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            setUser(null);
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
            // Even if there's an error, clear the user state
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle unauthorized errors
    const handleUnauthorized = () => {
        setUser(null);
        navigate('/login', { state: { message: 'Your session has expired. Please log in again.' } });
    };

    // Check if user has a specific permission
    const hasPermission = (permission) => {
        if (!user || !user.roles) return false;

        // Implement your permission checking logic here
        // This is a simple example - you might want to adjust based on how permissions are stored
        if (user.roles.includes('Admin')) return true; // Admin has all permissions

        // For other roles, you would check specific permissions
        // This would typically involve checking against a mapping of roles to permissions
        return false;
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        loadUser,
        handleUnauthorized,
        hasPermission,
        isAuthenticated: !!user,
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