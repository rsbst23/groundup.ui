import React from "react";
import { TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import FormPageLayout from "../../../components/layouts/FormPageLayout";
import useFormState from "../../../hooks/useFormState";
import { addInventoryCategory } from "../../../store/inventoryCategoriesSlice";

const AddInventoryCategory = () => {
    const dispatch = useDispatch();

    // useFormState now handles validation, errors, submission, and cancel action
    const form = useFormState({ name: "" }, addInventoryCategory, "../");

    return (
        <FormPageLayout
            title="Add New Category"
            onSave={form.handleSubmit(dispatch)}
            onCancel={form.handleCancel}
            error={form.apiError} // Pass error to FormPageLayout
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
