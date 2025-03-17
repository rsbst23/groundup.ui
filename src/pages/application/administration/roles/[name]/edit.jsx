import React, { useEffect } from "react";
import { TextField, Box, Typography, Chip } from "@mui/material";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import FormPageLayout from "../../../../../components/layouts/FormPageLayout";
import useFormState from "../../../../../hooks/useFormState";
import { editRole, fetchRoleByName } from "../../../../../store/rolesSlice";
import { usePage } from "../../../../../contexts/PageContext";

const EditRole = () => {
    const { t } = useTranslation();
    const { setPageConfig } = usePage();
    const { name } = useParams();

    // Define validation schema using Yup - for edit we only allow updating description
    const validationSchema = yup.object({
        description: yup
            .string()
            .nullable()
            .max(255, t("error_field_too_long", { max: 255 }))
    });

    const form = useFormState({
        fetchAction: fetchRoleByName,
        submitAction: editRole,
        successRedirect: "/application/administration/roles",
        id: name,
        isEditing: true,
        dataSelector: (state) => state.roles.roles.find((r) => r.name === name),
        validationSchema,
        // Transform data before submission
        onBeforeSubmit: (values) => {
            // For role editing, we're only submitting the fields that can be updated
            return {
                name: name,
                roleData: {
                    description: values.description
                }
            };
        }
    });

    useEffect(() => {
        setPageConfig({
            title: t("edit_role"),
            breadcrumb: [
                { label: t("administration"), path: "/application/administration" },
                { label: t("roles"), path: "/application/administration/roles" },
                { label: t("edit_role"), path: location.pathname },
            ],
        });
    }, [setPageConfig, location.pathname, t]);

    // Show loading state while fetching data
    if (form.loading || !form.initialized) {
        return <FormPageLayout title={t("edit_role")} loading={true} error={form.apiError} />;
    }

    return (
        <FormPageLayout
            title={t("edit_role")}
            onSave={form.handleSubmit}
            onCancel={form.handleCancel}
            error={form.apiError}
            showDetailedErrors={process.env.NODE_ENV !== 'production'}
        >
            {/* Display name as read-only */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>{t("role_name")}</Typography>
                <Typography variant="h6">{form.values.name}</Typography>
            </Box>

            {/* Display client role status */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>{t("client_role")}</Typography>
                {form.values.isClientRole ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label="Yes" color="primary" size="small" />
                        {form.values.containerId && (
                            <Typography variant="body2">
                                {t("client")}: {form.values.containerId}
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <Chip label="No" variant="outlined" size="small" />
                )}
            </Box>

            {/* Description field - editable */}
            <TextField
                label={t("description")}
                name="description"
                type="text"
                value={form.values.description || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.touched.description && !!form.errors.description}
                helperText={(form.touched.description && form.errors.description)}
                FormHelperTextProps={{
                    error: form.touched.description && !!form.errors.description
                }}
                fullWidth
                multiline
                rows={3}
                disabled={form.submitting}
                sx={{ mt: 2 }}
            />
        </FormPageLayout>
    );
};

export default EditRole;