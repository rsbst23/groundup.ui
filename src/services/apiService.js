import API_BASE_URL from "../config/apiConfig";

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

    console.log(`[ApiService] Making API request: ${options.method || 'GET'} ${fullUrl}`, options);

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
            console.log(`[ApiService] Parsed JSON response from ${fullUrl}:`, data);
        }

        if (!response.ok) {
            console.error(`[ApiService] Request failed: ${fullUrl}`, data || response.statusText);
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
        console.error(`[ApiService] Error during ${fullUrl} request:`, error);
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
        console.log(`[ApiService] GET request for ${resource}`);
        const result = await request(`${resource}`);
        console.log(`[ApiService] GET ${resource} completed with result:`, result);
        return result;
    },

    post: async (resource, data) => {
        console.log(`[ApiService] POST request for ${resource} with data:`, data);
        const result = await request(`${resource}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        console.log(`[ApiService] POST ${resource} completed with result:`, result);
        return result;
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