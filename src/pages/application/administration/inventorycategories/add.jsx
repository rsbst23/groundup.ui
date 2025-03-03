import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import FormPageLayout from "../../../../components/layouts/FormPageLayout";
import useFormState from "../../../../hooks/useFormState";
import { addInventoryCategory } from "../../../../store/inventoryCategoriesSlice";
import { usePage } from "../../../../contexts/PageContext";

const AddInventoryCategory = () => {
    const { t } = useTranslation(); // Hook for translations
    const { setPageConfig } = usePage();

    // Correct useFormState call
    const form = useFormState({
        fetchAction: null, // No need to fetch data for new category
        submitAction: addInventoryCategory,
        successRedirect: "../",
        id: null,
        isEditing: false,
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
        >
            <TextField
                label={t("category_name")}
                name="name"
                type="text"
                value={form.values.name}
                onChange={form.handleChange}
                error={!!form.errors.name}
                helperText={form.errors.name}
                fullWidth
                required
            />
        </FormPageLayout>
    );
};

export default AddInventoryCategory;
