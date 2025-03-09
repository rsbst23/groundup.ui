import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FormPageLayout from "../../../../../components/layouts/FormPageLayout";
import useFormState from "../../../../../hooks/useFormState";
import { editInventoryCategory, fetchInventoryCategoryById } from "../../../../../store/inventoryCategoriesSlice";
import { usePage } from "../../../../../contexts/PageContext";

const EditInventoryCategory = () => {
    const { t } = useTranslation();
    const { setPageConfig } = usePage();
    const { id } = useParams();

    useEffect(() => {
        setPageConfig({
            title: t("edit_category"),
            breadcrumb: [
                { label: t("inventory_categories"), path: "/application/administration/inventorycategories" },
                { label: t("edit_category"), path: location.pathname },
            ],
        });
    }, [setPageConfig, location.pathname, t]);

    // Custom validation function
    const validateForm = (values) => {
        const errors = {};

        if (!values.name || values.name.trim() === '') {
            errors.name = t("error_field_required");
        } else if (values.name.length > 100) {
            errors.name = t("error_field_too_long", { max: 100 });
        }

        return Object.keys(errors).length === 0;
    };

    const form = useFormState({
        fetchAction: fetchInventoryCategoryById,
        submitAction: editInventoryCategory,
        successRedirect: "/application/administration/inventorycategories",
        id,
        isEditing: true,
        dataSelector: (state) => state.inventoryCategories.categories.find((c) => c.id === parseInt(id, 10)),
        validate: validateForm
    });

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
            showDetailedErrors={process.env.NODE_ENV !== 'production'} // Show detailed errors in development
        >
            <TextField
                label={t("category_name")}
                name="name"
                type="text"
                value={form.values.name || ''}
                onChange={form.handleChange}
                error={!!form.errors.name}
                helperText={form.errors.name}
                fullWidth
                required
                disabled={form.submitting}
            />
        </FormPageLayout>
    );
};

export default EditInventoryCategory;