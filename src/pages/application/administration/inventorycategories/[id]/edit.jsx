import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import FormPageLayout from "../../../../../components/layouts/FormPageLayout";
import useFormState from "../../../../../hooks/useFormState";
import { editInventoryCategory, fetchInventoryCategoryById } from "../../../../../store/inventoryCategoriesSlice";
import { usePage } from "../../../../../contexts/PageContext";

const EditInventoryCategory = () => {
    const { setPageConfig } = usePage();
    const { id } = useParams(); // Get category ID from URL

    useEffect(() => {
        setPageConfig({
            title: "Edit Category",
            breadcrumb: [
                { label: "Inventory Categories", path: "/application/administration/inventorycategories" },
                { label: "Edit Category", path: location.pathname },
            ],
        });
    }, [setPageConfig, location.pathname]);

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
        return <FormPageLayout title="Edit Category" loading={true} error={form.apiError} />;
    }

    return (
        <FormPageLayout
            title="Edit Category"
            onSave={form.handleSubmit}
            onCancel={form.handleCancel}
            error={form.apiError}
        >
            <TextField
                label="Category Name"
                name="name"
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
