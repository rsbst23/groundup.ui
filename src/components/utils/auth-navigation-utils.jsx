import { useState } from "react";
import { Menu, MenuItem, IconButton, Typography, Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Reusable user menu component to be shared between TopBar and MainNav
export const UserMenu = ({ color = "inherit", textColor = "inherit" }) => {
    const { user } = useAuth();
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

    if (!user) return null;

    // Display username if available, otherwise fallback to email
    const displayName = user.username || user.email;

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
                    className="nav-button" // Add the nav-button class
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
                <MenuItem disabled>{user.fullName || user.email}</MenuItem>
                <Divider />
                <MenuItem onClick={() => handleNavigation("/profile")}>
                    <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                    Profile
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/settings")}>
                    <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                    Settings
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/logout")}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

// Utility function to check authentication status
export const isAuthenticated = () => {
    const { user } = useAuth();
    return !!user;
};