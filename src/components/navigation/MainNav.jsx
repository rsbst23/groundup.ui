import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { UserMenu } from "../utils/auth-navigation-utils";

const MainNav = () => {
    const { t } = useTranslation();
    const { user, isAuthenticated, login } = useAuth();

    // Handle login button click - redirect to Keycloak
    const handleLogin = () => {
        // Keep it simple for debugging - just redirect to home
        login(window.location.origin);
    };

    return (
        <AppBar position="static" sx={{ color: "#ffffff", bgcolor: "primary.main" }}>
            {/* Removed Container to be consistent with TopBar */}
            <Toolbar sx={{ px: { xs: 2, sm: 3 } }}> {/* Custom padding to control indentation */}
                {/* Left-aligned logo */}
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        color: "#ffffff",
                        "&:hover": {
                            color: "white",
                            textDecoration: "underline"
                        }
                    }}
                >
                    {t("app_name")}
                </Typography>

                {/* Right-aligned content */}
                <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 2 }}>
                    {isAuthenticated ? (
                        <UserMenu color="inherit" textColor="#ffffff" />
                    ) : (
                        <>
                            <Button
                                onClick={handleLogin} // Use handleLogin instead of navigating to /login
                                color="inherit"
                                variant="text"
                                className="nav-button" // Add this class to remove border
                            >
                                {t("login")}
                            </Button>
                            <Button
                                component={Link}
                                to="/application"
                                color="inherit"
                                variant="text"
                                className="nav-button" // Add this class to remove border
                            >
                                {t("enter_app")}
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MainNav;