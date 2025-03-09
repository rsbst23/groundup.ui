import React, { useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useTableConfig from "../../../../hooks/useTableConfig";
import DataTable from "../../../../components/DataTable";
import ListPageLayout from "../../../../components/layouts/ListPageLayout";
import { usePage } from "../../../../contexts/PageContext";
import {
    fetchInventoryCategories,
    removeInventoryCategory,
    exportInventoryCategoriesData
} from "../../../../store/inventoryCategoriesSlice";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

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

    // Use the table configuration hook with the export action
    const tableProps = useTableConfig({
        tableOptions: {
            fetchAction: fetchInventoryCategories,
            removeAction: removeInventoryCategory,
            exportAction: exportInventoryCategoriesData,
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

    // Define additional actions for the table with export options
    const additionalActions = useMemo(() => [
        {
            id: 'export-csv',
            label: t("export_csv"),
            icon: <FileDownloadIcon fontSize="small" />,
            onClick: () => tableProps.exportData('csv')
        },
        {
            id: 'export-json',
            label: t("export_json"),
            icon: <FileDownloadIcon fontSize="small" />,
            onClick: () => tableProps.exportData('json')
        }
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
            onExport={() => tableProps.exportData('csv')} // Use the hook's exportData method
            additionalActions={additionalActions}
            showTableActions={true}
        >
            <DataTable {...tableProps} />
        </ListPageLayout>
    );
};

export default InventoryCategoriesList;