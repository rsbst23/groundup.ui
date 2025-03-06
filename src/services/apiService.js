import API_BASE_URL from "../config/apiConfig";

const request = async (url, options = {}) => {
    const fullUrl = `${API_BASE_URL}${url}`;
    console.log(`Making API request: ${fullUrl}`, options);

    try {
        const response = await fetch(fullUrl, {
            credentials: "include", // Ensures cookies are sent
            ...options,
        });

        const isJsonResponse = response.headers
            .get("content-type")
            ?.includes("application/json");
        const data = isJsonResponse ? await response.json() : null;

        if (!response.ok) {
            console.error("API Request Failed:", fullUrl, data || response.statusText);
            throw {
                success: false,
                message:
                    data?.message ||
                    `Request failed: ${response.statusText}`,
                errors: data?.errors || [],
            };
        }

        return data;
    } catch (error) {
        console.error("Network/API Error:", error);
        throw {
            success: false,
            message: error.message || "Network error. Please try again.",
            errors: error.errors || ["Unexpected error occurred."],
        };
    }
};

const apiService = {
    get: async (resource) => request(`${resource}`), // Ensure correct `/api/auth/me`
    post: async (resource, data) =>
        request(`${resource}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }),
};

export default apiService;
