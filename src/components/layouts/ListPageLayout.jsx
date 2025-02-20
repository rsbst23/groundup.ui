import { Box, Paper, Typography } from "@mui/material";

/**
 * A reusable layout for list pages.
 * @param {Object} props
 * @param {ReactNode} props.title - The title of the list page.
 * @param {ReactNode} props.actions - Action buttons (e.g., "Add New Book").
 * @param {boolean} props.loading - Whether data is still loading.
 * @param {string|null} props.error - An error message (if any).
 * @param {ReactNode} props.children - The list content.
 */
const ListPageLayout = ({ title, actions, loading, error, children }) => {
    return (
        <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Page Title & Actions */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5">{title}</Typography>
                <Box>{actions}</Box>
            </Box>

            {/* Loading / Error States */}
            {loading ? (
                <Typography variant="h6">Loading...</Typography>
            ) : error ? (
                <Typography variant="h6" color="error">
                    Error: {error}
                </Typography>
            ) : (
                children
            )}
        </Paper>
    );
};

export default ListPageLayout;
