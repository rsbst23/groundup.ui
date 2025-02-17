import { Outlet, useLocation } from "react-router-dom";
import MainNav from "../navigation/MainNav";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import { Suspense } from "react";

const PublicLayout = () => {
    const location = useLocation();
    
    return (
        <Box>
            <MainNav />
            <Container maxWidth="lg">
                {/* Wrap Outlet in Suspense to ensure lazy-loaded pages render */}
                <Suspense fallback={<CircularProgress />}>
                    <Outlet />
                </Suspense>
            </Container>
        </Box>
    );
};

export default PublicLayout;
