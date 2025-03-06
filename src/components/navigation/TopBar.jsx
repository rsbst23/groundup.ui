import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    Button,
    IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../../contexts/AuthContext";

const navigationItems = [
    { label: "Home", path: "/application" },
    { label: "Administration", path: "/application/administration" }
];

const TopBar = () => {
    const location = useLocation();
    const { user, logout } = useAuth(); // Get user state from AuthContext

    // Debugging: Check when TopBar re-renders
    useEffect(() => {
        console.log("TopBar re-rendered, user state:", user);
    }, [user]);

    const handleLogout = async () => {
        await logout();
        console.log("User logged out, clearing state.");
    };

    return (
        <AppBar position="fixed" sx={{ boxShadow: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
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
                    Ground Up
                </Typography>

                {user ? (
                    <>
                        <IconButton color="inherit" sx={{ marginLeft: "auto" }}>
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu open={Boolean(user)}>
                            <MenuItem disabled>{user.fullName || user.email}</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/login"
                        sx={{ marginLeft: "auto" }}
                    >
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
