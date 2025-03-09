import API_BASE_URL from "../config/apiConfig";
import { HTTP_METHODS } from "../constants/api";

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

const request = async (url, options = {}) => {
    // Ensure url is properly formatted
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

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
            throw {
                success: false,
                message:
                    data?.message || data?.Message ||
                    `Request failed: ${response.statusText}`,
                errors: data?.errors || [],
                statusCode: response.status,
            };
        }

        return data;
    } catch (error) {
        throw {
            success: false,
            message: error.message || "Network error. Please try again.",
            errors: error.errors || ["Unexpected error occurred."],
        };
    }
};

const apiService = {
    // Base methods for authentication
    get: async (resource) => {
        return request(`${resource}`);
    },

    post: async (resource, data) => {
        return request(`${resource}`, {
            method: HTTP_METHODS.POST,
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
            method: HTTP_METHODS.POST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }),

    update: async (resource, id, data) =>
        request(`/${resource}/${id}`, {
            method: HTTP_METHODS.PUT,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, ...data }),
        }),

    delete: async (resource, id) =>
        request(`/${resource}/${id}`, {
            method: HTTP_METHODS.DELETE,
        }),
};

export default apiService;