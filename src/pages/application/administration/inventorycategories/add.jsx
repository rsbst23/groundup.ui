import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import FormPageLayout from "../../../../components/layouts/FormPageLayout";
import useFormState from "../../../../hooks/useFormState";
import { addInventoryCategory } from "../../../../store/inventoryCategoriesSlice";
import { usePage } from "../../../../contexts/PageContext";

const AddInventoryCategory = () => {
    const { t } = useTranslation();
    const { setPageConfig } = usePage();

    // Define validation schema using Yup
    const validationSchema = yup.object({
        name: yup
            .string()
            .required(t("error_field_required"))
            .trim()
            .max(100, t("error_field_too_long", { max: 100 }))
    });

    // Initialize form state with Yup validation
    const form = useFormState({
        fetchAction: null,
        submitAction: addInventoryCategory,
        successRedirect: "../",
        id: null,
        isEditing: false,
        validationSchema,
        initialValues: { name: '' }
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
                autoFocus
                disabled={form.submitting}
            />
        </FormPageLayout>
    );
};

export default AddInventoryCategory;