import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ErrorDisplay from "../common/ErrorDisplay";

/**
 * A reusable layout for list pages.
 * @param {Object} props
 * @param {ReactNode} props.title - The title of the list page.
 * @param {ReactNode} props.actions - Action buttons (e.g., "Add New Book").
 * @param {boolean} props.loading - Whether data is still loading.
 * @param {Error|Object|string} props.error - An error (if any).
 * @param {boolean} props.showDetailedErrors - Whether to show detailed error information.
 * @param {string} props.contextName - Context name for error tracking.
 * @param {ReactNode} props.children - The list content.
 */
const ListPageLayout = ({
    title,
    actions,
    loading,
    error,
    showDetailedErrors = false,
    contextName = "ListPage",
    children
}) => {
    const { t } = useTranslation();

    return (
        <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5">{title}</Typography>
                <Box>{actions}</Box>
            </Box>

            {loading ? (
                <Typography variant="h6">{t("loading")}</Typography>
            ) : error ? (
                <ErrorDisplay
                    error={error}
                    showDetails={showDetailedErrors}
                    context={contextName}
                />
            ) : (
                children
            )}
        </Paper>
    );
};

export default ListPageLayout;