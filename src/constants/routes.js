// src/constants/routes.js
// Application routes

// Base routes
export const BASE_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    APPLICATION: '/application',
    PUBLIC: '/public',
};

// Application routes
export const APP_ROUTES = {
    DASHBOARD: '/application',
    ADMINISTRATION: '/application/administration',
    INVENTORY_CATEGORIES: '/application/administration/inventorycategories',
};

// Route actions
export const ROUTE_ACTIONS = {
    ADD: 'add',
    EDIT: 'edit',
    VIEW: 'view',
};

// Build full paths with route actions
export const buildRoutePath = (basePath, id = null, action = null) => {
    if (!id && !action) return basePath;
    if (!id && action) return `${basePath}/${action}`;
    if (id && !action) return `${basePath}/${id}`;
    return `${basePath}/${id}/${action}`;
};