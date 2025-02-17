import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "../navigation/Sidebar";
import TopBar from "../navigation/TopBar";

const ApplicationLayout = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
            <CssBaseline />

            {/* TopBar should be above everything */}
            <TopBar />

            {/* Sidebar and main content in a flex container */}
            <Box sx={{ display: "flex", flexGrow: 1 }}>
                <Sidebar />

                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Outlet /> {/* This loads the page content */}
                </Box>
            </Box>
        </Box>
    );
};

export default ApplicationLayout;
