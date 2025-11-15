import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import FormPageLayout from "../../../../../../components/layouts/FormPageLayout";
import useFormState from "../../../../../../hooks/useFormState";
import { editPolicy, fetchPolicyByName } from "../../../../../../store/policiesSlice";
import { usePage } from "../../../../../../contexts/PageContext";

const EditPolicy = () => {
  const { t } = useTranslation();
  const { setPageConfig } = usePage();
  const { name } = useParams();

  // Define validation schema using Yup - for edit we only allow updating description
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

  const form = useFormState({
    fetchAction: fetchPolicyByName,
    submitAction: editPolicy,
    successRedirect: "/application/administration/security/policies",
    id: name,
    isEditing: true,
    dataSelector: (state) => state.policies.policies.find((p) => p.name === name),
    validationSchema,
    // Transform data before submission
    onBeforeSubmit: (values) => {
      // For policy editing, we're submitting both name and description
      return {
        name: name, // Original name for identifying the policy
        policyData: {
          name: values.name,
          description: values.description,
        },
      };
    },
  });

  useEffect(() => {
    setPageConfig({
      title: t("Edit Policy"),
      breadcrumb: [
        { label: t("administration"), path: "/application/administration" },
        { label: t("security"), path: "/application/administration/security" },
        { label: t("policies"), path: "/application/administration/security/policies" },
        { label: t("Edit Policy"), path: location.pathname },
      ],
    });
  }, [setPageConfig, location.pathname, t]);

  // Show loading state while fetching data
  if (form.loading || !form.initialized) {
    return (
      <FormPageLayout
        title={t("Edit Policy")}
        loading={true}
        error={form.apiError}
      />
    );
  }

  return (
    <FormPageLayout
      title={t("Edit Policy")}
      onSave={form.handleSubmit}
      onCancel={form.handleCancel}
      error={form.apiError}
      showDetailedErrors={process.env.NODE_ENV !== "production"}
    >
      {/* Policy Name field - editable */}
      <TextField
        label={t("policy_name")}
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

      {/* Description field - editable */}
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

export default EditPolicy;
