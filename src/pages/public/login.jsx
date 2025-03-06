import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Use AuthContext instead of Redux
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, CircularProgress, Alert } from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Use login function from AuthContext
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        console.log("Submitting login form with:", { email, password }); // Debugging

        const result = await login({ email, password }); // Use AuthContext login

        if (result.success) {
            console.log("Login successful, navigating to /");
            navigate("/"); // Redirect to dashboard on success
        } else {
            console.error("Login failed:", result.message);
            setError(result.message);
        }

        setLoading(false);
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
