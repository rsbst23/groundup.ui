import API_BASE_URL from "../config/apiConfig";
import { logError } from '../utils/errorUtils';

// Build query string from parameters
const buildQueryString = ({ pageNumber, pageSize, sortBy, sortDirection, filters = {}, searchTerm, format, exportAll }) => {
    const queryParams = [];

    if (pageNumber !== undefined) queryParams.push(`pageNumber=${pageNumber}`);
    if (pageSize !== undefined) queryParams.push(`pageSize=${pageSize}`);
    if (sortBy !== undefined) queryParams.push(`sortBy=${encodeURIComponent(sortBy)}`);
    if (sortDirection !== undefined) queryParams.push(`sortDirection=${encodeURIComponent(sortDirection)}`);
    if (searchTerm) queryParams.push(`searchTerm=${encodeURIComponent(searchTerm)}`);
    if (format) queryParams.push(`format=${encodeURIComponent(format)}`);
    if (exportAll !== undefined) queryParams.push(`exportAll=${exportAll}`);

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
 * @param {boolean} returnBlob - Whether to return a blob instead of JSON
 * @returns {Promise<Object|Blob>} - The response data
 * @throws {Object} - Standardized error object
 */
const request = async (url, options = {}, returnBlob = false) => {
    // Ensure url is properly formatted
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    const context = `ApiService:${options.method || 'GET'}:${url}`;

    try {
        const response = await fetch(fullUrl, {
            credentials: "include", // Ensures cookies are sent
            ...options,
        });

        if (!response.ok) {
            // Try to parse error as JSON if possible
            let errorData = null;
            try {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    errorData = await response.json();
                }
            } catch (parseError) {
                // Ignore JSON parsing errors
            }

            // Create standardized error object
            const errorObj = {
                success: false,
                message: errorData?.message || errorData?.error || `Request failed: ${response.statusText}`,
                errors: errorData?.errors || [],
                statusCode: response.status,
                data: errorData
            };

            logError(context, errorObj);
            throw errorObj;
        }

        // Handle blob responses for exports
        if (returnBlob) {
            return await response.blob();
        }

        // Handle JSON responses for regular API calls
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }

        // Handle other response types
        return await response.text();
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
    getList: async (resource, { pageNumber = 1, pageSize = 10, sortBy = "Name", sortDirection = "asc", filters = {}, searchTerm = "" } = {}) => {
        const queryParams = {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
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

    /**
     * Export data from a resource
     * @param {string} resource - Resource name
     * @param {Object} options - Export options
     * @param {string} options.format - Export format (csv, xlsx, etc.)
     * @param {Object} options.filters - Filters to apply
     * @param {string} options.sortBy - Field to sort by
     * @param {string} options.sortDirection - Sort direction (asc/desc)
     * @param {boolean} options.exportAll - Whether to export all records (default: true)
     * @returns {Promise<Blob>} - Blob containing the exported data
     */
    export: async (resource, { format = 'csv', filters = {}, sortBy = "Name", exportAll = true } = {}) => {
        const queryParams = [];

        // Add format parameter
        queryParams.push(`format=${encodeURIComponent(format)}`);

        // Add sort parameter if provided
        if (sortBy) {
            queryParams.push(`sortBy=${encodeURIComponent(sortBy)}`);
        }

        // Add exportAll parameter
        queryParams.push(`exportAll=${exportAll}`);

        // Process filters
        if (filters && Object.keys(filters).length > 0) {
            Object.entries(filters)
                .filter(([_, value]) => value !== undefined && value !== null && value !== '')
                .forEach(([key, value]) => {
                    if (key.startsWith("MinFilters") || key.startsWith("MaxFilters")) {
                        queryParams.push(`${key}=${encodeURIComponent(value)}`);
                    } else {
                        queryParams.push(`ContainsFilters[${key}]=${encodeURIComponent(value)}`);
                    }
                });
        }

        const queryString = queryParams.join("&");

        // Make request and get blob response
        const response = await fetch(`${API_BASE_URL}/${resource}/export?${queryString}`, {
            method: "GET",
            headers: { "Accept": "application/octet-stream" },
            credentials: "include" // Ensures cookies are sent
        });

        if (!response.ok) {
            // Try to parse error as JSON if possible
            let errorData = null;
            try {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    errorData = await response.json();
                }
            } catch (parseError) {
                // Ignore JSON parsing errors
            }

            // Create standardized error object
            const errorObj = {
                success: false,
                message: errorData?.message || errorData?.error || `Export failed: ${response.statusText}`,
                errors: errorData?.errors || [],
                statusCode: response.status,
                data: errorData
            };

            logError(`ApiService:GET:${resource}/export`, errorObj);
            throw errorObj;
        }

        // Return the blob
        return await response.blob();
    }
};

export default apiService;