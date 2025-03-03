import { Box, Paper, Typography, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * A reusable layout for list pages.
 * @param {Object} props
 * @param {ReactNode} props.title - The title of the list page.
 * @param {ReactNode} props.actions - Action buttons (e.g., "Add New Book").
 * @param {boolean} props.loading - Whether data is still loading.
 * @param {string|Object|null} props.error - An error message (if any).
 * @param {ReactNode} props.children - The list content.
 */
const ListPageLayout = ({ title, actions, loading, error, children }) => {
    const { t } = useTranslation();

    // Extract error message if it's an object
    const errorMessage =
        error && typeof error === "object"
            ? error.message || (Array.isArray(error.errors) ? error.errors.join(", ") : t("error_occurred"))
            : error;

    return (
        <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5">{title}</Typography>
                <Box>{actions}</Box>
            </Box>

            {loading ? (
                <Typography variant="h6">{t("loading")}</Typography>
            ) : errorMessage ? (
                <Alert severity="error">{String(errorMessage)}</Alert>
            ) : (
                children
            )}
        </Paper>
    );
};

export default ListPageLayout;
