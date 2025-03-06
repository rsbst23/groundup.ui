import API_BASE_URL from "../config/apiConfig";

const authService = {
    login: async ({ email, password }) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Ensures cookies are sent with the request
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }

        return response.json();
    },

    logout: async () => {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
    },

    getUser: async () => {
        return fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            credentials: "include", // Ensure cookies are sent
        }).then((res) => res.json());
    },
};

export default authService;
