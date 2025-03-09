import API_BASE_URL from "../config/apiConfig";

const authService = {
    login: async ({ identifier, password }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ identifier, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }

            return response.json();
        } catch (error) {
            console.error('Auth service login error:', error);
            throw error;
        }
    },

    register: async ({ email, username, password, fullName }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password, fullName }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            return data;
        } catch (error) {
            console.error('Auth service register error:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Logout failed");
            }

            return response.json();
        } catch (error) {
            console.error('Auth service logout error:', error);
            throw error;
        }
    },

    getUser: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: "GET",
                credentials: "include", // Ensure cookies are sent
            });

            if (!response.ok && response.status !== 401) {
                // We handle 401 gracefully since it just means the user isn't logged in
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to get user data");
            }

            return response.json();
        } catch (error) {
            console.error('Auth service getUser error:', error);
            throw error;
        }
    },
};

export default authService;