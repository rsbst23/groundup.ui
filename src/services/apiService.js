import API_BASE_URL from "../config/apiConfig";

const request = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        const isJsonResponse = response.headers.get("content-type")?.includes("application/json");
        const data = isJsonResponse ? await response.json() : null; // Parse JSON only if available

        if (!response.ok) {
            console.error("API Error Response:", data);

            // Throw structured API response if available, otherwise fallback to statusText
            throw {
                success: false,
                message: data?.message || `Request failed: ${response.statusText}`,
                errors: data?.errors || [],
            };
        }

        return data;
    } catch (error) {
        console.error("Network/API Request Failed:", error);

        // Handle network errors separately
        throw {
            success: false,
            message: error.message || "Network error. Please try again.",
            errors: error.errors || ["Unexpected error occurred."],
        };
    }
};

const apiService = {
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
