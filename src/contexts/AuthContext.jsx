import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../services/apiService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    console.log("AuthProvider is mounted");

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch current user on page load
    useEffect(() => {
        console.log("Fetching user in AuthContext useEffect");

        apiService.get("/auth/me")
            .then((response) => {
                console.log("Fetched user data in AuthContext:", response);
                if (response.success) {
                    setUser(() => {
                        console.log("Updating user state in AuthContext:", response.data);
                        return response.data;
                    });
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (credentials) => {
        console.log("login() in AuthContext called with credentials:", credentials); // Debugging log

        try {
            const response = await apiService.post("/auth/login", credentials);
            console.log("Login Response from API:", response); // Debug API response

            const userData = await apiService.get("/auth/me");
            console.log("User Data after login:", userData);

            setUser(null); 

            setTimeout(() => {
                setUser(userData.data); // Force React to detect state change
                console.log("User state updated in AuthContext:", userData.data);
            }, 100);

            return { success: true };
        } catch (error) {
            console.error("Login error in AuthContext:", error);
            return { success: false, message: error.message };
        }
    };


    const logout = async () => {
        await apiService.post("/auth/logout");
        console.log("User logged out, clearing state.");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
