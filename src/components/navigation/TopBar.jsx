import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    Button,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTranslation } from "react-i18next";

const TopBar = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);

    const navigationItems = [
        { label: t("home"), path: "/application" },
        { label: t("administration"), path: "/application/administration" }
    ];

    const activeItem =
        [...navigationItems].sort((a, b) => b.path.length - a.path.length) // Sort by path length descending
            .find((item) => location.pathname.startsWith(item.path)) || navigationItems[0];

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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
                    {t("app_name")}
                </Typography>

                <Button
                    color="inherit"
                    onClick={handleMenuOpen}
                    endIcon={<ArrowDropDownIcon />}
                    sx={{ textTransform: "none", fontSize: "1rem" }}
                >
                    {activeItem.label}
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    {navigationItems.map((item) => (
                        <MenuItem
                            key={item.path}
                            component={RouterLink}
                            to={item.path}
                            selected={location.pathname.startsWith(item.path)}
                            onClick={handleMenuClose}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
