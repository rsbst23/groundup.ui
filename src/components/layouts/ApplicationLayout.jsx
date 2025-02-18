import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "../navigation/Sidebar";
import TopBar from "../navigation/TopBar";
import ActionBar from "../ActionBar";
import { PageProvider } from "../../contexts/PageContext";

const topBarHeight = 64; // Default height for MUI AppBar
const actionBarHeight = 64; // Custom height for ActionBar
const sidebarWidth = 240;

const ApplicationLayout = () => {
    return (
        <PageProvider>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
                <CssBaseline />

                {/* Top Navigation Bar (Fixed at the top) */}
                <TopBar />

                {/* Action Bar (Directly below TopBar) */}
                <Box
                    sx={{
                        position: "fixed",
                        top: topBarHeight,
                        width: "100vw",
                        zIndex: 10, // Ensure it's above the sidebar and main content
                    }}
                >
                    <ActionBar />
                </Box>

                {/* Sidebar + Main Content Wrapper */}
                <Box
                    sx={{
                        display: "flex",
                        flexGrow: 1,
                        mt: `${topBarHeight + actionBarHeight}px`, // Push content below TopBar & ActionBar
                    }}
                >
                    {/* Sidebar (Fixed height, scrolls separately if needed) */}
                    <Box
                        sx={{
                            width: sidebarWidth,
                            height: `calc(100vh - ${topBarHeight + actionBarHeight}px)`,
                            overflowY: "auto",
                            position: "fixed",
                            top: `${topBarHeight + actionBarHeight}px`,
                            left: 0,
                        }}
                    >
                        <Sidebar />
                    </Box>

                    {/* Main Content Area (Takes up remaining space) */}
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            ml: `${sidebarWidth}px`, // Push main content to the right of the sidebar
                            width: `calc(100vw - ${sidebarWidth}px)`,
                            borderRadius: "8px",
                            backgroundColor: "#ffffff",
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
