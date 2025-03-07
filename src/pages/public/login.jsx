import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, CircularProgress, Alert } from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth(); // Also get the user to see updates
    const navigate = useNavigate();

    // Debug: Watch for user state changes in Login component
    useEffect(() => {
        console.log("[Login] User state changed:", user);
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        console.log("[Login] Starting login process with:", { email, password });

        try {
            const result = await login({ email, password });
            console.log("[Login] Login result:", result);

            if (result.success) {
                console.log("[Login] Login successful, will navigate to /");
                // Add a small delay to ensure state propagation
                setTimeout(() => {
                    console.log("[Login] Navigating to / now. Current user state:", user);
                    navigate("/");
                }, 500);
            } else {
                console.error("[Login] Login failed:", result.message);
                setError(result.message);
            }
        } catch (error) {
            console.error("[Login] Exception during login:", error);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h5" align="center" sx={{ mt: 4, mb: 2 }}>
                Login
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Login"}
                </Button>
            </form>
        </Container>
    );
};

export default Login;