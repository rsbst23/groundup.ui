import API_BASE_URL from "../config/apiConfig";
import { logError } from '../utils/errorUtils';

// Build query string from parameters
const buildQueryString = ({ pageNumber, pageSize, sortBy, filters = {}, searchTerm }) => {
    const queryParams = [];

    if (pageNumber !== undefined) queryParams.push(`pageNumber=${pageNumber}`);
    if (pageSize !== undefined) queryParams.push(`pageSize=${pageSize}`);
    if (sortBy !== undefined) queryParams.push(`sortBy=${encodeURIComponent(sortBy)}`);
    if (searchTerm) queryParams.push(`searchTerm=${encodeURIComponent(searchTerm)}`);

    // Process filters
    if (filters && Object.keys(filters).length > 0) {
        Object.entries(filters)
            .filter(([_, value]) => value !== undefined && value !== null)
            .forEach(([key, value]) => {
                if (key.startsWith("MinFilters") || key.startsWith("MaxFilters")) {
                    queryParams.push(`${key}=${encodeURIComponent(value)}`);
                } else {
                    queryParams.push(`ContainsFilters[${key}]=${encodeURIComponent(value)}`);
                }
            });
    }

    return queryParams.join("&");
};

/**
 * Standardized request function with consistent error handling
 * @param {string} url - The URL to request
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - The response data
 * @throws {Object} - Standardized error object
 */
const request = async (url, options = {}) => {
    // Ensure url is properly formatted
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    const context = `ApiService:${options.method || 'GET'}:${url}`;

    try {
        const response = await fetch(fullUrl, {
            credentials: "include", // Ensures cookies are sent
            ...options,
        });

        const isJsonResponse = response.headers
            .get("content-type")
            ?.includes("application/json");

        let data = null;
        if (isJsonResponse) {
            data = await response.json();
        }

        if (!response.ok) {
            // Create standardized error object
            const errorObj = {
                success: false,
                message: data?.message || data?.error || `Request failed: ${response.statusText}`,
                errors: data?.errors || [],
                statusCode: response.status,
                data: data
            };

            logError(context, errorObj);
            throw errorObj;
        }

        return data;
    } catch (error) {
        // If error is already in our format, just pass it through
        if (error.success === false && error.statusCode) {
            throw error;
        }

        // Otherwise, normalize the error
        const errorObj = {
            success: false,
            message: error.message || "Network error. Please try again.",
            errors: error.errors || ["An unexpected error occurred."],
            statusCode: error.statusCode || 0,
        };

        logError(context, errorObj);
        throw errorObj;
    }
};

const apiService = {
    // Base methods for authentication
    get: async (resource) => {
        return await request(`${resource}`);
    },

    post: async (resource, data) => {
        return await request(`${resource}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    },

    // Resource-specific methods for inventory management
    getList: async (resource, { pageNumber = 1, pageSize = 10, sortBy = "Name", filters = {}, searchTerm = "" } = {}) => {
        const queryParams = {
            pageNumber,
            pageSize,
            sortBy,
            filters,
            searchTerm
        };

        const queryString = buildQueryString(queryParams);
        return request(`/${resource}?${queryString}`);
    },

    getAll: async (resource) => request(`/${resource}`),

    getById: async (resource, id) => request(`/${resource}/${id}`),

    create: async (resource, data) =>
        request(`/${resource}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }),

    update: async (resource, id, data) =>
        request(`/${resource}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, ...data }),
        }),

    delete: async (resource, id) =>
        request(`/${resource}/${id}`, {
            method: "DELETE",
        }),
};

export default apiService;