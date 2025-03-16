// src/services/keycloakService.js
import Keycloak from 'keycloak-js';
import keycloakConfig from '../config/keycloakConfig';

// Create Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

// Add essential event listeners
keycloak.onAuthSuccess = () => {
    console.log('Auth success');
};

keycloak.onAuthError = (error) => {
    console.error('Auth error:', error);
};

keycloak.onAuthRefreshSuccess = () => {
    console.log('Auth refresh success');
};

keycloak.onAuthRefreshError = () => {
    console.error('Auth refresh error');
};

keycloak.onAuthLogout = () => {
    console.log('Auth logout');
};

keycloak.onTokenExpired = () => {
    console.log('Token expired, refreshing...');
    keycloak
        .updateToken(30)
        .then(() => {
            console.log('Token refreshed');
        })
        .catch((error) => {
            console.error('Failed to refresh token:', error);
        });
};

/**
 * Initialize Keycloak
 * @returns {Promise<boolean>} True if initialized successfully
 */
const initKeycloak = () => {
    return new Promise((resolve, reject) => {
        keycloak
            .init({
                // Only perform minimal initialization without SSO checks
                onLoad: null, // Don't use onLoad at all 
                checkLoginIframe: false,
                promiseType: 'native',
                enableLogging: false,
            })
            .then((authenticated) => {
                console.log('Keycloak initialized, authenticated:', authenticated);
                resolve(authenticated);
            })
            .catch((error) => {
                console.error('Failed to initialize Keycloak:', error);
                reject(error);
            });
    });
};

/**
 * Get user information from Keycloak token
 * @returns {Object} User info object
 */
const getUserInfo = () => {
    if (!keycloak.authenticated) {
        return null;
    }

    return {
        id: keycloak.subject, // Subject identifier
        username: keycloak.tokenParsed?.preferred_username || '',
        email: keycloak.tokenParsed?.email || '',
        name: keycloak.tokenParsed?.name || '',
        firstName: keycloak.tokenParsed?.given_name || '',
        lastName: keycloak.tokenParsed?.family_name || '',
        roles: keycloak.tokenParsed?.realm_access?.roles || [],
    };
};

/**
 * Check if user has a specific role
 * @param {string} role Role to check
 * @returns {boolean} True if user has role
 */
const hasRole = (role) => {
    if (!keycloak.authenticated || !keycloak.tokenParsed?.realm_access?.roles) {
        return false;
    }

    return keycloak.tokenParsed.realm_access.roles.includes(role);
};

/**
 * Login user
 * @param {string} redirectUri Optional redirect URI after login
 */
const login = (redirectUri) => {
    // Use a simple redirect to avoid complications
    const options = {
        redirectUri: redirectUri || window.location.origin,
    };

    console.log('Login options:', options);
    keycloak.login(options);
};

/**
 * Logout user
 * @param {string} redirectUri Optional redirect URI after logout
 */
const logout = (redirectUri) => {
    keycloak.logout({ redirectUri: redirectUri || window.location.origin });
};

/**
 * Get the authentication token for API requests
 * @returns {string|null} The token or null if not authenticated
 */
const getToken = () => {
    if (!keycloak.authenticated) {
        return null;
    }

    return keycloak.token;
};

/**
 * Check if token is valid and refresh if needed
 * @param {number} minValidity Minimum validity time in seconds
 * @returns {Promise<string>} The valid token
 */
const updateToken = async (minValidity = 30) => {
    if (!keycloak.authenticated) {
        throw new Error('Not authenticated');
    }

    try {
        const refreshed = await keycloak.updateToken(minValidity);
        if (refreshed) {
            console.log('Token refreshed');
        }
        return keycloak.token;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        // Force re-login on token refresh failure
        keycloak.login();
        throw error;
    }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
const isAuthenticated = () => {
    return !!keycloak.authenticated;
};

const keycloakService = {
    keycloak,
    initKeycloak,
    getUserInfo,
    hasRole,
    login,
    logout,
    getToken,
    updateToken,
    isAuthenticated,
};

export default keycloakService;