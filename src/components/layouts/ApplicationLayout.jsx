import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "../navigation/Sidebar";
import TopBar from "../navigation/TopBar";
import { PageProvider } from "../../contexts/PageContext";

const topBarHeight = 64; // Height of TopBar
const sidebarWidth = 240;

const ApplicationLayout = () => {
    return (
        <PageProvider>
            <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
                <CssBaseline />

                {/* Sidebar - Stays fixed on the left */}
                <Sidebar />

                {/* Main Content Area */}
                <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    {/* Top Navigation Bar - Fixed at the top */}
                    <TopBar />

                    {/* Scrollable Page Content */}
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
                        <Outlet />
                    </Box>
                </Box>
            </Box>
        </PageProvider>
    );
};

export default ApplicationLayout;
