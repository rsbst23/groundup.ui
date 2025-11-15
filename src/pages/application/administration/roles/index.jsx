import React, { useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useTableConfig from "../../../../hooks/useTableConfig";
import DataTable from "../../../../components/DataTable";
import ListPageLayout from "../../../../components/layouts/ListPageLayout";
import { usePage } from "../../../../contexts/PageContext";
import {
  fetchRoles,
  removeRole,
  exportRolesData,
} from "../../../../store/rolesSlice";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const RolesList = () => {
  const { t } = useTranslation();
  const { setPageConfig } = usePage();

  // Set page-specific configuration
  useEffect(() => {
    const breadcrumbData = [
      { label: t("administration"), path: "/application/administration" },
      { label: t("roles"), path: "/application/administration/roles" },
    ];

    setPageConfig({
      breadcrumb: breadcrumbData,
      title: t("roles"),
    });
  }, [setPageConfig, t]);

  // Define column configurations with translation keys
  const columnDefs = [
    {
      field: "name",
      translationKey: "role_name",
      filterable: true,
      filterType: "text",
      editLink: true,
    },
    {
      field: "description",
      translationKey: "description",
      filterable: true,
      filterType: "text",
    },
  ];

  // Use the table configuration hook with the export action
  const tableProps = useTableConfig({
    tableOptions: {
      fetchAction: fetchRoles,
      removeAction: removeRole,
      exportAction: exportRolesData,
      dataSelector: (state) => ({
        items: state.roles.roles,
        loading: state.roles.loading,
        error: state.roles.error,
        totalRecords: state.roles.totalRecords,
      }),
      defaultSort: "name",
      contextName: "Roles",
    },
    columnDefs,
    translationPrefix: "",
  });

  // Define additional actions for the table with export options
  const additionalActions = useMemo(
    () => [
      {
        id: "export-csv",
        label: t("export_csv"),
        icon: <FileDownloadIcon fontSize="small" />,
        onClick: () => tableProps.exportData("csv"),
      },
      {
        id: "export-json",
        label: t("export_json"),
        icon: <FileDownloadIcon fontSize="small" />,
        onClick: () => tableProps.exportData("json"),
      },
    ],
    [t, tableProps]
  );

  return (
    <ListPageLayout
      title={t("roles")}
      actions={
        <Button
          component={RouterLink}
          to="add"
          variant="contained"
          color="primary"
        >
          {t("add_role")}
        </Button>
      }
      loading={tableProps.loading}
      error={tableProps.error}
      contextName={tableProps.contextName}
      showDetailedErrors={process.env.NODE_ENV !== "production"}
      tableState={tableProps}
      onResetFilters={tableProps.resetFilters}
      onExport={() => tableProps.exportData("csv")}
      additionalActions={additionalActions}
      showTableActions={true}
    >
      <DataTable {...tableProps} />
    </ListPageLayout>
  );
};

export default RolesList;
