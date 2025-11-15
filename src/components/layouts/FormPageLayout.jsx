import React, { useEffect, useRef } from "react";
import { Box, Paper, Typography, Button, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import ErrorDisplay from "../common/ErrorDisplay";

/**
 * Generic Form Page Layout for adding/editing records.
 * @param {Object} props
 * @param {string} props.title - The page title.
 * @param {ReactNode} props.children - The form content.
 * @param {Function} props.onSave - Handler for form submission.
 * @param {Function} props.onCancel - Handler for cancel action.
 * @param {Error|Object|string} props.error - An error (if any).
 * @param {boolean} props.showDetailedErrors - Whether to show detailed error information.
 * @param {boolean} props.loading - Show a loading state while fetching data.
 */
const FormPageLayout = ({
  title,
  children,
  onSave,
  onCancel,
  error,
  showDetailedErrors = false,
  loading,
}) => {
  const { t } = useTranslation();
  const formRef = useRef(null);

  useEffect(() => {
    if (!loading && formRef.current) {
      // Find the first input element after the data has loaded
      const firstInput = formRef.current.querySelector(
        "input, textarea, select"
      );
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [loading]); // Only refocus when loading state changes

  return (
    <Container maxWidth={false} sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, width: "100%" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t(title)}
        </Typography>

        {/* Use the standardized error display component */}
        {error && (
          <ErrorDisplay error={error} showDetails={showDetailedErrors} />
        )}

        <Box
          component="form"
          ref={formRef}
          onSubmit={onSave}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
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
            <Button onClick={onCancel} color="secondary cancel-button">
              {t("cancel")}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default FormPageLayout;
