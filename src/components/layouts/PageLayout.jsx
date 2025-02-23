import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
//import { usePage } from "../../../contexts/PageContext";
import Breadcrumbs from "../navigation/Breadcrumbs"; // Import Breadcrumbs component

const PageLayout = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            {/* Use the Breadcrumbs Component */}
            <Box sx={{ pt: 2, pb: 2, borderBottom: "1px solid #ccc" }}>
                <Breadcrumbs />
            </Box>
            <Outlet />
        </Box>
    );
};

export default PageLayout;
