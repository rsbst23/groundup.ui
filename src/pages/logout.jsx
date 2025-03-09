import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, CircularProgress, Alert } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CancelIcon from "@mui/icons-material/Cancel";

const Logout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { logout, user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // If not logged in, redirect to login page
    useEffect(() => {
        if (!isAuthenticated && !loading) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate, loading]);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            // The redirection will happen automatically via the effect
        } catch (error) {
            console.error("Logout failed:", error);
            setError("Failed to log out. Please try again.");
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    // If not authenticated and not in the process of logging out, show nothing (will redirect)
    if (!isAuthenticated && !loading) {
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "70vh",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    maxWidth: 500,
                    width: "100%",
                    textAlign: "center",
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    Are you sure you want to log out?
                </Typography>

                {user && (
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        You are currently logged in as <strong>{user.email}</strong>
                    </Typography>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Confirm Logout"}
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Logout;