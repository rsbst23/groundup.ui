import { Box, IconButton } from "@mui/material";
import { Outlet, useOutletContext } from "react-router-dom";
import Breadcrumbs from "../navigation/Breadcrumbs";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const PageLayout = () => {
    const { handleDrawerToggle } = useOutletContext(); // Get the sidebar toggle function
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Detect small screens

    return (
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            {/* Breadcrumbs and Hamburger Menu */}
            <Box sx={{ pt: 2, pb: 2, borderBottom: "1px solid #ccc", display: "flex", alignItems: "center" }}>
                {/* Show hamburger menu only on mobile */}
                {isMobile && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }} // Margin for spacing
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Breadcrumbs Component */}
                <Breadcrumbs />
            </Box>

            <Outlet />
        </Box>
    );
};

export default PageLayout;
