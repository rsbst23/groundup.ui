import API_BASE_URL from "../config/apiConfig";

const request = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        const isJsonResponse = response.headers.get("content-type")?.includes("application/json");
        const data = isJsonResponse ? await response.json() : null; // Parse JSON only if available

        if (!response.ok) {
            // Throw structured API response if available, otherwise fallback to statusText
            throw {
                success: false,
                message: data?.message || data?.Message || `Request failed: ${response.statusText}`,
                errors: data?.errors || [],
            };
        }

        return data;
    } catch (error) {
        // Handle network errors separately
        throw {
            success: false,
            message: error.message || "Network error. Please try again.",
            errors: error.errors || ["Unexpected error occurred."],
        };
    }
};

const buildQueryString = ({ pageNumber, pageSize, sortBy, filters = {} }) => {
    const filterParams = Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== null) // Remove undefined/null values
        .map(([key, value]) => {
            if (value) {
                if (key.startsWith("MinFilters") || key.startsWith("MaxFilters")) {
                    return `${key}=${encodeURIComponent(value)}`;
                } else {
                    return `ContainsFilters[${key}]=${encodeURIComponent(value)}`;
                }
            }
        })
        .join("&");
    
    const queryParams = [
        `pageNumber=${pageNumber}`,
        `pageSize=${pageSize}`,
        `sortBy=${encodeURIComponent(sortBy)}`,
        filterParams,
    ].filter(Boolean);

    return queryParams.join("&");
};

const apiService = {
    getList: async (resource, { pageNumber = 1, pageSize = 10, sortBy = "Name", filters = {} } = {}) => {
        
        const queryParams = {
            pageNumber,
            pageSize,
            sortBy: sortBy,
            filters
        };
        
        const queryString = buildQueryString(queryParams);
        return request(`${API_BASE_URL}/${resource}?${queryString}`);
    },

    getAll: async (resource) => request(`${API_BASE_URL}/${resource}`),

    getById: async (resource, id) => request(`${API_BASE_URL}/${resource}/${id}`),

    create: async (resource, data) =>
        request(`${API_BASE_URL}/${resource}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }),

    update: async (resource, id, data) =>
        request(`${API_BASE_URL}/${resource}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, ...data }),
        }),

    delete: async (resource, id) =>
        request(`${API_BASE_URL}/${resource}/${id}`, {
            method: "DELETE",
        }),
};

export default apiService;
