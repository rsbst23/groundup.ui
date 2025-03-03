import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FormPageLayout from "../../../../../components/layouts/FormPageLayout";
import useFormState from "../../../../../hooks/useFormState";
import { editInventoryCategory, fetchInventoryCategoryById } from "../../../../../store/inventoryCategoriesSlice";
import { usePage } from "../../../../../contexts/PageContext";

const EditInventoryCategory = () => {
    const { t } = useTranslation(); // Hook for translations
    const { setPageConfig } = usePage();
    const { id } = useParams(); // Get category ID from URL

    useEffect(() => {
        setPageConfig({
            title: t("edit_category"), // Translate page title
            breadcrumb: [
                { label: t("inventory_categories"), path: "/application/administration/inventorycategories" },
                { label: t("edit_category"), path: location.pathname },
            ],
        });
    }, [setPageConfig, location.pathname, t]);

    const form = useFormState({
        fetchAction: fetchInventoryCategoryById,
        submitAction: editInventoryCategory,
        successRedirect: "/application/administration/inventorycategories",
        id,
        isEditing: true,
        dataSelector: (state) => state.inventoryCategories.categories.find((c) => c.id === parseInt(id, 10)),
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

export default EditInventoryCategory;
