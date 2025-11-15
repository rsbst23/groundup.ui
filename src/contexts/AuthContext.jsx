import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import keycloakService from "../services/keycloakService";
import tenantService from "../services/tenantService";

// Create context
const AuthContext = createContext();

// Create provider
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tenant-related state
  const [tenantRequired, setTenantRequired] = useState(false);
  const [availableTenants, setAvailableTenants] = useState(null);
  const [tenantSelected, setTenantSelected] = useState(false);

  // Initialize Keycloak on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const isAuthenticated = await keycloakService.initKeycloak();
        setAuthenticated(isAuthenticated);

        if (isAuthenticated) {
          const userInfo = keycloakService.getUserInfo();
          setUser(userInfo);

          // After Keycloak authentication, exchange for custom token
          await exchangeForCustomToken();
        }

        setInitialized(true);
        setError(null);
      } catch (err) {
        console.error("Failed to initialize authentication:", err);
        setError("Failed to initialize authentication");
        setAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Exchange Keycloak token for custom token with tenant context
  const exchangeForCustomToken = async (tenantId = null) => {
    try {
      const result = await tenantService.setTenant(tenantId);

      if (result.selectionRequired) {
        // User has multiple tenants - navigate to selection page
        setTenantRequired(true);
        setAvailableTenants(result.availableTenants);
        setTenantSelected(false);

        // Only redirect if not already on select-tenant page
        if (location.pathname !== "/select-tenant") {
          navigate("/select-tenant");
        }
      } else {
        // Tenant automatically selected (single tenant or explicit selection)
        // Custom token is now in HttpOnly cookie
        setTenantRequired(false);
        setAvailableTenants(null);
        setTenantSelected(true);

        // Don't redirect - let user stay on current page or let ProtectedRoute handle it
      }
    } catch (err) {
      console.error("Failed to exchange token:", err);
      throw err;
    }
  };

  // Login function
  const login = (redirectUri) => {
    keycloakService.login(redirectUri);
  };

  // Logout function - clear both Keycloak session and custom token cookie
  const logout = async (redirectUri) => {
    try {
      // Clear custom token cookie via API
      await tenantService.logout();
    } catch (err) {
      console.error("Error during API logout:", err);
    } finally {
      // Always logout from Keycloak
      keycloakService.logout(redirectUri);
    }
  };

  // Select tenant - called when user chooses from multiple tenants
  const selectTenant = async (tenantId) => {
    try {
      setLoading(true);
      await exchangeForCustomToken(tenantId);
    } catch (err) {
      console.error("Failed to select tenant:", err);
      setError("Failed to select tenant");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!authenticated || !user) return false;

    // Check if user has admin role
    if (user.roles.includes("admin")) return true;

    // Check for specific role/permission
    return user.roles.includes(permission);
  };

  // Handle unauthorized errors from API
  const handleUnauthorized = () => {
    // Force refresh token, if that fails Keycloak will redirect to login
    keycloakService.updateToken(0).catch(() => {
      // Token refresh failed, Keycloak will handle redirection
      console.log("Session expired, redirecting to login");
    });
  };

  const value = {
    initialized,
    user,
    loading,
    error,
    login,
    logout,
    selectTenant,
    hasPermission,
    handleUnauthorized,
    isAuthenticated: authenticated,
    tenantRequired,
    availableTenants,
    tenantSelected,
    keycloak: keycloakService.keycloak, // Expose Keycloak instance if needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
