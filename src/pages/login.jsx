// Modified login.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Paper,
    Alert,
    Box
} from "@mui/material";

const Login = () => {
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
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Authentication System Update
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                    The authentication system is being updated to use Keycloak.
                    During this transition, all users are automatically authenticated.
                </Alert>

                <Box textAlign="center" mt={2}>
                    <Typography variant="body1">
                        You will be redirected to the home page automatically...
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;