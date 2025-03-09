import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import FormPageLayout from "../../../../components/layouts/FormPageLayout";
import useFormState from "../../../../hooks/useFormState";
import { addInventoryCategory } from "../../../../store/inventoryCategoriesSlice";
import { usePage } from "../../../../contexts/PageContext";

const AddInventoryCategory = () => {
    const { t } = useTranslation();
    const { setPageConfig } = usePage();

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

    // Initialize form state with improved error handling
    const form = useFormState({
        fetchAction: null,
        submitAction: addInventoryCategory,
        successRedirect: "../",
        id: null,
        isEditing: false,
        validate: validateForm
    });

    useEffect(() => {
        setPageConfig({
            breadcrumb: [
                { label: t("inventory_categories"), path: "/application/administration/inventorycategories" },
                { label: t("add_category"), path: "/application/administration/inventorycategories/add" }
            ],
        });
    }, [setPageConfig, t]);

    return (
        <FormPageLayout
            title={t("add_category")}
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
                helperText={form.errors.name || ''}
                fullWidth
                required
                autoFocus
                disabled={form.submitting}
            />
        </FormPageLayout>
    );
};

export default AddInventoryCategory;