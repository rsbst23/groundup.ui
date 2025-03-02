import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "../navigation/Sidebar";
import TopBar from "../navigation/TopBar";
import { PageProvider } from "../../contexts/PageContext";
import { useState } from "react";

const topBarHeight = 64; // Height of TopBar

const ApplicationLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <PageProvider>
            <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
                <CssBaseline />

                {/* Sidebar - Collapses on small screens */}
                <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

                {/* Main Content Area */}
                <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <TopBar />

                    {/* Pass handleDrawerToggle to PageLayout via Outlet context */}
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            pl: 3,
                            pr: 3,
                            pb: 3,
                            mt: `${topBarHeight}px`,
                            backgroundColor: "background.default",
                        }}
                    >
                        <Outlet context={{ handleDrawerToggle }} />
                    </Box>
                </Box>
            </Box>
        </PageProvider>
    );
};

export default ApplicationLayout;
