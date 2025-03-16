import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Alert } from "@mui/material";

const Logout = () => {
    const navigate = useNavigate();

    // Redirect to home on mount
    useEffect(() => {
        // Short delay to allow reading the message
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

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
                    Authentication System Update
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                    The authentication system is being updated to use Keycloak.
                    During this transition, logout functionality is disabled.
                </Alert>

                <Typography variant="body1">
                    You will be redirected to the home page automatically...
                </Typography>
            </Paper>
        </Box>
    );
};

export default Logout;