// src/constants/api.js
// API-related constants

// Environment-based API URL
export const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api';

// Resource endpoints
export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
    },
    INVENTORY_CATEGORIES: '/inventory-categories'
};

// HTTP methods
export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
};

// API response status
export const API_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
};