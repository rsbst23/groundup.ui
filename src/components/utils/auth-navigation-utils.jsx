import { useState } from "react";
import { Menu, MenuItem, IconButton, Typography, Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// UserMenu component with Keycloak integration
export const UserMenu = ({ color = "inherit", textColor = "inherit" }) => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path) => {
        handleMenuClose();
        navigate(path);
    };

    const handleLogout = () => {
        handleMenuClose();
        // Redirect back to home page after logout
        logout(window.location.origin);
    };

    if (!user) return null;

    // Get display name from Keycloak user object
    // Fallback options to ensure we always display something
    const displayName = user.name || user.username || user.email || 'User';

    return (
        <>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 1, color: textColor }}>
                    {displayName}
                </Typography>
                <IconButton
                    color={color}
                    onClick={handleMenuOpen}
                    aria-controls="user-menu"
                    aria-haspopup="true"
                    className="nav-button"
                    sx={{
                        '&:focus': {
                            outline: 'none',
                            boxShadow: 'none',
                        },
                        '&.MuiIconButton-root': {
                            border: 'none',
                        },
                        '&.MuiIconButton-root:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }
                    }}
                >
                    <AccountCircleIcon />
                </IconButton>
            </div>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem disabled>
                    {user.email || user.username || 'User'}
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleNavigation("/profile")}>
                    <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                    Profile
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/settings")}>
                    <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

// Utility function that uses useAuth hook
export const isAuthenticated = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated;
};