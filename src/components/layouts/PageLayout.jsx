import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { usePage } from "../../contexts/PageContext";

const PageLayout = () => {
    const { pageConfig } = usePage();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            {/* Header using pageConfig's breadcrumb */}
            <Box sx={{ pt: 2, pb: 2, borderBottom: "1px solid #ccc" }}>
                <Typography variant="body2">
                    Home / {pageConfig?.breadcrumb || "Current Page"}
                </Typography>
            </Box>
            <Outlet />
        </Box>
    );
};

export default PageLayout;
