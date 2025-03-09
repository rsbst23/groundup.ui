// login.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
    TextField,
    Button,
    Container,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    Box
} from "@mui/material";

const Login = () => {
    const [identifier, setIdentifier] = useState(""); // Changed from email to identifier
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login, user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from || "/";
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const success = await login({ identifier, password }); // Changed from email to identifier

            if (!success) {
                console.error("[Login] Login failed");
                setError("Login failed. Please check your credentials.");
            }
            // Redirect will happen automatically via the effect
        } catch (error) {
            console.error("[Login] Exception during login:", error);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Don't render the form if already authenticated
    if (isAuthenticated) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Sign In
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username or Email"
                        type="text"
                        fullWidth
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        size="large"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Sign In"}
                    </Button>
                </form>

                <Divider sx={{ my: 3 }} />

                <Box textAlign="center">
                    <Typography variant="body1">
                        Don't have an account?{" "}
                        <Link to="/register" style={{ textDecoration: "none" }}>
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;