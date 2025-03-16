import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { UserMenu } from "../utils/auth-navigation-utils";

const MainNav = () => {
    const { t } = useTranslation();
    const { user, isAuthenticated, login, loading } = useAuth();

    // Handle login button click - redirect to Keycloak
    const handleLogin = () => {
        login(window.location.origin);
    };

    // Render auth-related UI based on authentication state
    const renderAuthUI = () => {
        // While loading auth state, show a subtle loading indicator or nothing
        if (loading) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} color="inherit" sx={{ opacity: 0.7 }} />
                </Box>
            );
        }

        // Once loaded, show either UserMenu or login button
        return isAuthenticated ? (
            <UserMenu color="inherit" textColor="#ffffff" />
        ) : (
            <>
                <Button
                    onClick={handleLogin}
                    color="inherit"
                    variant="text"
                    className="nav-button"
                >
                    {t("login")}
                </Button>
                <Button
                    component={Link}
                    to="/application"
                    color="inherit"
                    variant="text"
                    className="nav-button"
                >
                    {t("enter_app")}
                </Button>
            </>
        );
    };

    return (
        <AppBar position="static" sx={{ color: "#ffffff", bgcolor: "primary.main" }}>
            <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
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
                    {renderAuthUI()}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default MainNav;