import React, { useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useTableConfig from "../../../../hooks/useTableConfig";
import DataTable from "../../../../components/DataTable";
import ListPageLayout from "../../../../components/layouts/ListPageLayout";
import { usePage } from "../../../../contexts/PageContext";
import { fetchInventoryCategories, removeInventoryCategory } from "../../../../store/inventoryCategoriesSlice";

const InventoryCategoriesList = () => {
    const { t } = useTranslation();
    const { setPageConfig } = usePage();

    // Set page-specific configuration
    useEffect(() => {
        const breadcrumbData = [
            { label: t("inventory_categories"), path: "/application/administration/inventorycategories" }
        ];

        setPageConfig({
            breadcrumb: breadcrumbData,
            title: t("inventory_categories")
        });
    }, [setPageConfig, t]);

    // Define column configurations with translation keys
    const columnDefs = [
        {
            field: "name",
            translationKey: "category_name",
            filterable: true,
            filterType: "text",
            editLink: true
        },
        {
            field: "createdDate",
            translationKey: "created_date",
            filterable: true,
            filterType: "date",
            type: "date"
        },
    ];

    // Use the table configuration hook
    const tableProps = useTableConfig({
        tableOptions: {
            fetchAction: fetchInventoryCategories,
            removeAction: removeInventoryCategory,
            dataSelector: (state) => ({
                items: state.inventoryCategories.categories,
                loading: state.inventoryCategories.loading,
                error: state.inventoryCategories.error,
                totalRecords: state.inventoryCategories.totalRecords,
            }),
            defaultSort: "name",
            contextName: "InventoryCategories"
        },
        columnDefs,
        translationPrefix: ""
    });

    // Define additional actions for the table
    const additionalActions = useMemo(() => [
        //{
        //    id: 'import',
        //    label: t("import_categories"),
        //    icon: <UploadFileIcon fontSize="small" />,
        //    onClick: () => {
        //        console.log('Import categories clicked');
        //    }
        //},
        //{ divider: true },
        //{
        //    id: 'export-csv',
        //    label: t("export_csv"),
        //    icon: <FileDownloadIcon fontSize="small" />,
        //    onClick: () => {
        //        tableProps.exportData('csv');
        //    }
        //},
        //{
        //    id: 'export-excel',
        //    label: t("export_excel"),
        //    icon: <FileDownloadIcon fontSize="small" />,
        //    onClick: () => {
        //        tableProps.exportData('excel');
        //    }
        //},
        //{ divider: true },
        //{
        //    id: 'settings',
        //    label: t("category_settings"),
        //    icon: <SettingsIcon fontSize="small" />,
        //    onClick: () => {
        //        console.log('Category settings clicked');
        //    }
        //}
    ], [t, tableProps]);

    return (
        <ListPageLayout
            title={t("inventory_categories")}
            actions={
                <Button component={RouterLink} to="add" variant="contained" color="primary">
                    {t("add_category")}
                </Button>
            }
            loading={tableProps.loading}
            error={tableProps.error}
            contextName={tableProps.contextName}
            showDetailedErrors={process.env.NODE_ENV !== 'production'}
            tableState={tableProps}
            onResetFilters={tableProps.resetFilters}
            onExport={() => tableProps.exportData('default')}
            additionalActions={additionalActions}
            showTableActions={true}
        >
            <DataTable {...tableProps} />
        </ListPageLayout>
    );
};

export default InventoryCategoriesList;