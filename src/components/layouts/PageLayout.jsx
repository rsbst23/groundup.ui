import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import ActionBar from "../../components/ActionBar"; // Assuming ActionBar is in /components
import { usePage } from "../../contexts/PageContext";

const PageLayout = () => {
    const { pageConfig } = usePage(); // Get title, breadcrumb, and actions

    return (
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            {/* ActionBar now reads values from PageContext */}
            <ActionBar
                title={pageConfig?.title || "Untitled"}
                breadcrumb={pageConfig?.breadcrumb || "Current Page"}
                actions={pageConfig?.actions || null}
            />
            <Outlet /> {/* Renders the page's content */}
        </Box>
    );
};

export default PageLayout;
