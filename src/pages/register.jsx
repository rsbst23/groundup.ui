import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Container,
    Typography,
    Paper,
    Alert,
    Box,
    Button
} from "@mui/material";

const Register = () => {
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
                    Registration System Update
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                    The authentication system is being updated to use Keycloak.
                    During this transition, registration functionality is disabled.
                </Alert>

                <Box textAlign="center" mt={3}>
                    <Typography variant="body1" paragraph>
                        User registration will be handled by Keycloak in the future.
                    </Typography>

                    <Typography variant="body1">
                        You will be redirected to the home page automatically...
                    </Typography>

                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Go to Home Page
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;