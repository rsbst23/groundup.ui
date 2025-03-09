import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import FormPageLayout from "../../../../../components/layouts/FormPageLayout";
import useFormState from "../../../../../hooks/useFormState";
import { editInventoryCategory, fetchInventoryCategoryById } from "../../../../../store/inventoryCategoriesSlice";
import { usePage } from "../../../../../contexts/PageContext";

const EditInventoryCategory = () => {
    const { t } = useTranslation();
    const { setPageConfig } = usePage();
    const { id } = useParams();

    // Define validation schema using Yup
    const validationSchema = yup.object({
        name: yup
            .string()
            .required(t("error_field_required"))
            .trim()
            .max(100, t("error_field_too_long", { max: 100 }))
    });

    const form = useFormState({
        fetchAction: fetchInventoryCategoryById,
        submitAction: editInventoryCategory,
        successRedirect: "/application/administration/inventorycategories",
        id,
        isEditing: true,
        dataSelector: (state) => state.inventoryCategories.categories.find((c) => c.id === parseInt(id, 10)),
        validationSchema
    });

    useEffect(() => {
        setPageConfig({
            title: t("edit_category"),
            breadcrumb: [
                { label: t("inventory_categories"), path: "/application/administration/inventorycategories" },
                { label: t("edit_category"), path: location.pathname },
            ],
        });
    }, [setPageConfig, location.pathname, t]);

    // Show loading state while fetching data
    if (form.loading || !form.initialized) {
        return <FormPageLayout title={t("edit_category")} loading={true} error={form.apiError} />;
    }

    return (
        <FormPageLayout
            title={t("edit_category")}
            onSave={form.handleSubmit}
            onCancel={form.handleCancel}
            error={form.apiError}
            showDetailedErrors={process.env.NODE_ENV !== 'production'}
        >
            <TextField
                label={t("category_name")}
                name="name"
                type="text"
                value={form.values.name || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                // Show error only if field is touched
                error={form.touched.name && !!form.errors.name}
                // Show helper text for errors or required indicator
                helperText={(form.touched.name && form.errors.name) || t('field_required')}
                FormHelperTextProps={{
                    // Only show error style when there's an actual error
                    error: form.touched.name && !!form.errors.name
                }}
                fullWidth
                required
                disabled={form.submitting}
            />
        </FormPageLayout>
    );
};

export default EditInventoryCategory;