import API_BASE_URL from "../config/apiConfig";

const request = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
    }
    return response.status !== 204 ? await response.json() : null; // Handle DELETE which returns no content
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
