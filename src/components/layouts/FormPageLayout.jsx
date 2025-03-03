import React, { useEffect, useRef } from "react";
import { Box, Paper, Typography, Button, Container, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Generic Form Page Layout for adding/editing records.
 * @param {Object} props
 * @param {string} props.title - The page title.
 * @param {ReactNode} props.children - The form content.
 * @param {Function} props.onSave - Handler for form submission.
 * @param {Function} props.onCancel - Handler for cancel action.
 * @param {string|null} props.error - An error message (if any).
 * @param {boolean} props.loading - Show a loading state while fetching data.
 */
const FormPageLayout = ({ title, children, onSave, onCancel, error, loading }) => {
    const { t } = useTranslation();
    const formRef = useRef(null);

    useEffect(() => {
        if (!loading && formRef.current) {
            // Find the first input element after the data has loaded
            const firstInput = formRef.current.querySelector("input, textarea, select");
            if (firstInput) {
                firstInput.focus();
            }
        }
    }, [children, loading]); // Trigger focus when form content updates

    return (
        <Container maxWidth={false} sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, width: "100%" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {t(title)}
                </Typography>

                {/* Display error message above the form with proper spacing */}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>}

                <Box
                    component="form"
                    ref={formRef}
                    onSubmit={onSave}
                    sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
                >
                    {loading ? (
                        <Typography variant="body1">{t("loading_data")}</Typography>
                    ) : (
                        children
                    )}
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
