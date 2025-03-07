import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    AppBar,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    Button,
    Box,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useAuth } from "../../contexts/AuthContext";
import { UserMenu } from "../utils/auth-navigation-utils";

const navigationItems = [
    { label: "Home", path: "/application" },
    { label: "Administration", path: "/application/administration" }
];

const TopBar = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const { user } = useAuth();

    // Navigation menu state
    const [navAnchorEl, setNavAnchorEl] = useState(null);

    // Find the active navigation item
    const activeItem =
        [...navigationItems].sort((a, b) => b.path.length - a.path.length) // Sort by path length descending
            .find((item) => location.pathname.startsWith(item.path)) || navigationItems[0];

    // Navigation menu handlers
    const handleNavMenuOpen = (event) => {
        setNavAnchorEl(event.currentTarget);
    };

    const handleNavMenuClose = () => {
        setNavAnchorEl(null);
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                // Removed boxShadow: 0, to allow default shadow 
                // (which matches the MainNav)
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}
        >
            <Toolbar>
                {/* App Logo */}
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        color: "inherit",
                        mr: 2,
                        "&:hover": { color: "white", textDecoration: "underline" },
                    }}
                >
                    {t("app_name")}
                </Typography>

                {/* Navigation Menu - Using theme styles */}
                <Button
                    color="inherit"
                    variant="text"
                    onClick={handleNavMenuOpen}
                    endIcon={<ArrowDropDownIcon />}
                    sx={{ fontSize: "1rem" }}
                    disableRipple
                    disableElevation
                >
                    {activeItem.label}
                </Button>

                <Menu
                    anchorEl={navAnchorEl}
                    open={Boolean(navAnchorEl)}
                    onClose={handleNavMenuClose}
                    elevation={3}
                >
                    {navigationItems.map((item) => (
                        <MenuItem
                            key={item.path}
                            component={RouterLink}
                            to={item.path}
                            selected={location.pathname.startsWith(item.path)}
                            onClick={handleNavMenuClose}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </Menu>

                {/* Spacer */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Authentication UI */}
                {user ? (
                    <UserMenu />
                ) : (
                    <Button
                        color="inherit"
                        variant="text"
                        component={RouterLink}
                        to="/login"
                    >
                        {t("login")}
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;