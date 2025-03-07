import { useState } from "react";
import { Menu, MenuItem, IconButton, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../../contexts/AuthContext";

// Reusable user menu component to be shared between TopBar and MainNav
export const UserMenu = ({ color = "inherit", textColor = "inherit" }) => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        console.log("[UserMenu] Logout clicked");
        await logout();
        handleMenuClose();
    };

    if (!user) return null;

    return (
        <>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 1, color: textColor }}>
                    {user.fullName || user.email}
                </Typography>
                <IconButton
                    color={color}
                    onClick={handleMenuOpen}
                    aria-controls="user-menu"
                    aria-haspopup="true"
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
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

// Utility function to check authentication status
export const isAuthenticated = () => {
    const { user } = useAuth();
    return !!user;
};