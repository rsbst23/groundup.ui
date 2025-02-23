import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next"; // Import translation hook
import { usePage } from "../../../contexts/PageContext";

const AdministrationLanding = () => {
    const { t } = useTranslation(); // Hook for translations
    const { setPageConfig } = usePage();

    useEffect(() => {
        setPageConfig({
            title: t("administration"),
            breadcrumb: [
                { label: t("administration"), path: "/application/administration" }
            ],
        });
    }, [setPageConfig, t]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4">{t("administration")}</Typography>
            <Typography variant="body1">{t("administration_description")}</Typography>
        </Box>
    );
};

export default AdministrationLanding;
