import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "../navigation/Sidebar";
import TopBar from "../navigation/TopBar";

const drawerWidth = 240;
const topBarHeight = 64; // Default height for MUI AppBar

const ApplicationLayout = () => {
    return (
        <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
            <CssBaseline />

            {/* TopBar (Fixed at Top) */}
            <TopBar sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} />

            {/* Sidebar (Fixed Below TopBar) */}
            <Sidebar />

            {/* Main Content Area (Ensures Sidebar Doesn't Overlap) */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: `${topBarHeight}px`, // Pushes down to make space for TopBar
                }}
            >
                <Outlet /> {/* Renders the current page content */}
            </Box>
        </Box>
    );
};

export default ApplicationLayout;
