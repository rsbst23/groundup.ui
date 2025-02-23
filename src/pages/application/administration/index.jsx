import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { usePage } from "../../../contexts/PageContext";

const AdministrationLanding = () => {
    const { setPageConfig } = usePage();

    useEffect(() => {
        setPageConfig({
            title: "Administration",
            breadcrumb: [
                { label: "Administration", path: "/application/administration" }
            ],
        });
    }, [setPageConfig]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4">Administration</Typography>
            <Typography variant="body1">Manage your system settings and configurations here.</Typography>
        </Box>
    );
};

export default AdministrationLanding;
