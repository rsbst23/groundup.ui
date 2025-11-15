import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import FormPageLayout from "../../../../components/layouts/FormPageLayout";
import useFormState from "../../../../hooks/useFormState";
import { addRole } from "../../../../store/rolesSlice";
import { usePage } from "../../../../contexts/PageContext";

const AddRole = () => {
  const { t } = useTranslation();
  const { setPageConfig } = usePage();

  // Define validation schema using Yup
  const validationSchema = yup.object({
    name: yup
      .string()
      .required(t("error_field_required"))
      .trim()
      .max(100, t("error_field_too_long", { max: 100 })),
    description: yup
      .string()
      .nullable()
      .max(255, t("error_field_too_long", { max: 255 })),
  });

  // Initialize form state with Yup validation
  const form = useFormState({
    fetchAction: null,
    submitAction: addRole,
    successRedirect: "../",
    id: null,
    isEditing: false,
    validationSchema,
    initialValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    setPageConfig({
      breadcrumb: [
        { label: t("administration"), path: "/application/administration" },
        { label: t("roles"), path: "/application/administration/roles" },
        { label: t("add_role"), path: "/application/administration/roles/add" },
      ],
    });
  }, [setPageConfig, t]);

  return (
    <FormPageLayout
      title={t("add_role")}
      onSave={form.handleSubmit}
      onCancel={form.handleCancel}
      error={form.apiError}
      showDetailedErrors={process.env.NODE_ENV !== "production"}
    >
      <TextField
        label={t("role_name")}
        name="name"
        type="text"
        value={form.values.name || ""}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.touched.name && !!form.errors.name}
        helperText={
          (form.touched.name && form.errors.name) || t("field_required")
        }
        FormHelperTextProps={{
          error: form.touched.name && !!form.errors.name,
        }}
        fullWidth
        required
        autoFocus
        disabled={form.submitting}
      />

      <TextField
        label={t("description")}
        name="description"
        type="text"
        value={form.values.description || ""}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.touched.description && !!form.errors.description}
        helperText={form.touched.description && form.errors.description}
        FormHelperTextProps={{
          error: form.touched.description && !!form.errors.description,
        }}
        fullWidth
        multiline
        rows={3}
        disabled={form.submitting}
        sx={{ mt: 2 }}
      />
    </FormPageLayout>
  );
};

export default AddRole;
