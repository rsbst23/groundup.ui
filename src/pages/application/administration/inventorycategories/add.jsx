import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import FormPageLayout from "../../../../components/layouts/FormPageLayout";
import useFormState from "../../../../hooks/useFormState";
import { addInventoryCategory } from "../../../../store/inventoryCategoriesSlice";
import { usePage } from "../../../../contexts/PageContext";

const AddInventoryCategory = () => {
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
                { label: "Inventory Categories", path: "/application/administration/inventorycategories" },
                { label: "Add Category", path: "/application/administration/inventorycategories/add" }
            ],
        });
    }, [setPageConfig]);

    return (
        <FormPageLayout
            title="Add Category"
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

export default AddInventoryCategory;
