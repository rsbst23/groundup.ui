import { Box, Paper, Typography, Button, Container, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Generic Form Page Layout for adding new records.
 * @param {Object} props
 * @param {string} props.title - The page title.
 * @param {ReactNode} props.children - The form content.
 * @param {Function} props.onSave - Handler for form submission.
 * @param {Function} props.onCancel - Handler for cancel action.
 * @param {string|null} props.error - An error message (if any).
 */
const FormPageLayout = ({ title, children, onSave, onCancel, error }) => {
    const { t } = useTranslation();

    return (
        <Container maxWidth={false} sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, width: "100%" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {t(title)}
                </Typography>

                {/* Display error message above the form with proper spacing */}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>}

                <Box component="form" onSubmit={onSave} sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                    {children}
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button type="submit" variant="contained" color="primary">
                            {t("save")}
                        </Button>
                        <Button onClick={onCancel} color="secondary">
                            {t("cancel")}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default FormPageLayout;
