import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FormPageLayout from "../../../../components/layouts/FormPageLayout";
import useFormState from "../../../../hooks/useFormState";
import { editInventoryCategory, fetchInventoryCategoryById } from "../../../../store/inventoryCategoriesSlice";

const EditInventoryCategory = () => {
    const { id } = useParams(); // Get category ID from URL
    const dispatch = useDispatch();
    const [initialValues, setInitialValues] = useState(null); // Track initial form values
    const [loading, setLoading] = useState(true); // Track loading state

    // Fetch the category from Redux store or API
    const category = useSelector((state) =>
        state.inventoryCategories.categories.find((c) => c.id === parseInt(id, 10))
    );

    useEffect(() => {
        if (!category) {
            dispatch(fetchInventoryCategoryById(id))
                .unwrap()
                .then((data) => {
                    setInitialValues({ name: data.name }); // Set initial form values
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching category:", error);
                    setLoading(false);
                });
        } else {
            setInitialValues({ name: category.name }); // Use existing Redux data if available
            setLoading(false);
        }
    }, [dispatch, id, category]);

    // Wait for data to load before initializing the form
    const form = useFormState(initialValues, (values) => editInventoryCategory({ id, ...values }), "../../", true);

    // Show loading state while fetching data
    if (loading || !form.initialized) {
        return <FormPageLayout title="Edit Category" loading={true} />;
    }

    return (
        <FormPageLayout
            title="Edit Category"
            onSave={form.handleSubmit(dispatch)}
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
