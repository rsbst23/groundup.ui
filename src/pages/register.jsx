import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Paper,
    Divider
} from "@mui/material";
import authService from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        fullName: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // If already logged in, redirect to home
    if (isAuthenticated) {
        navigate("/");
        return null;
    }

    const validate = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid";
        }

        // Username validation
        if (!formData.username) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = "Username can only contain letters, numbers, and underscores";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Full name validation
        if (!formData.fullName) {
            newErrors.fullName = "Full name is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setGeneralError("");

        // Validate form
        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const response = await authService.register({
                email: formData.email,
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName
            });

            if (response.success) {
                setSuccess(true);
                // Reset form
                setFormData({
                    email: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                    fullName: ""
                });

                // Redirect to login after a short delay
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setGeneralError(response.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setGeneralError(error.message || "An unexpected error occurred");

            // Handle specific error messages from API
            if (error.errors && error.errors.length > 0) {
                const errorMap = {};
                error.errors.forEach(err => {
                    if (err.includes("Email")) errorMap.email = err;
                    else if (err.includes("Username")) errorMap.username = err;
                    else if (err.includes("Password")) errorMap.password = err;
                    else if (err.includes("Name")) errorMap.fullName = err;
                });
                setErrors({ ...errors, ...errorMap });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ mt: 4, p: 4, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Create an Account
                </Typography>

                {success ? (
                    <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                        Registration successful! Redirecting to login page...
                    </Alert>
                ) : (
                    <>
                        {generalError && (
                            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                                {generalError}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                margin="normal"
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                                disabled={loading}
                            />

                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                margin="normal"
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={loading}
                            />

                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                margin="normal"
                                error={!!errors.username}
                                helperText={errors.username}
                                disabled={loading}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                margin="normal"
                                error={!!errors.password}
                                helperText={errors.password}
                                disabled={loading}
                            />

                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                margin="normal"
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                disabled={loading}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Register"}
                            </Button>
                        </form>
                    </>
                )}

                <Divider sx={{ my: 2 }} />

                <Box textAlign="center">
                    <Typography variant="body2">
                        Already have an account?{" "}
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            Sign in
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;