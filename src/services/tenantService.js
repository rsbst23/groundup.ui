// src/services/tenantService.js
import API_BASE_URL from "../config/apiConfig";
import keycloakService from "./keycloakService";

/**
 * Service for managing tenant selection and authentication flow.
 * Works with the dual-token system:
 * 1. Uses Keycloak token to call /api/auth/set-tenant
 * 2. API returns custom token (stored in HttpOnly cookie)
 * 3. All subsequent API calls use the cookie automatically
 */
const tenantService = {
  /**
   * Exchange Keycloak token for custom API token with tenant context.
   * The API will set an HttpOnly cookie with the custom token.
   *
   * @param {number|null} tenantId - Tenant ID to select, or null for auto-select
   * @returns {Promise<{selectionRequired: boolean, availableTenants: Array, token: string}>}
   */
  setTenant: async (tenantId = null) => {
    // Get Keycloak token (will refresh if needed)
    const keycloakToken = await keycloakService.updateToken(30);

    if (!keycloakToken) {
      throw new Error("Not authenticated with Keycloak");
    }

    const response = await fetch(`${API_BASE_URL}/auth/set-tenant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keycloakToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: Include cookies
      body: JSON.stringify({ tenantId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to set tenant");
    }

    const result = await response.json();

    // API response format: { data: { selectionRequired, availableTenants, token }, success, message }
    return result.data;
  },

  /**
   * Get current user profile using the custom token (from cookie).
   * This verifies that tenant selection was successful.
   *
   * @returns {Promise<Object>} User profile with tenant context
   */
  getUserProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include", // Use cookie for authentication
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Tenant not selected or session expired");
      }
      throw new Error("Failed to get user profile");
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Logout - clears the custom token cookie.
   */
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  },
};

export default tenantService;
