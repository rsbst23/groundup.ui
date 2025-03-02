import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next"; // Import i18next translation
import { Link as RouterLink } from "react-router-dom";
import useTableData from "../../../../hooks/useTableData";
import DataTable from "../../../../components/DataTable";
import ListPageLayout from "../../../../components/layouts/ListPageLayout";
import { usePage } from "../../../../contexts/PageContext";
import { fetchInventoryCategories, removeInventoryCategory } from "../../../../store/inventoryCategoriesSlice";

// Define columns for the data table
const InventoryCategoriesList = () => {
    const { t } = useTranslation(); // Hook for translations
    const { setPageConfig } = usePage();

    // Set page-specific configuration
    useEffect(() => {
        const breadcrumbData = [
            { label: t("inventory_categories"), path: "/application/administration/inventorycategories" }
        ];

        setPageConfig({
            breadcrumb: breadcrumbData,
        });
    }, [setPageConfig, t]);

    const tableProps = useTableData({
        fetchAction: fetchInventoryCategories,
        removeAction: removeInventoryCategory,
        dataSelector: (state) => ({
            items: state.inventoryCategories.categories,
            loading: state.inventoryCategories.loading,
            error: state.inventoryCategories.error,
            totalRecords: state.inventoryCategories.totalRecords,
        }),
        defaultSort: "name",
    });

    const columns = [
        { field: "name", label: t("category_name"), filterable: true, filterType: "text", editLink: true },
        { field: "createdDate", label: t("created_date"), filterable: true, filterType: "date", type: "date" },
    ];

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
        >
            <DataTable {...tableProps} columns={columns} />
        </ListPageLayout>
    );
};

export default InventoryCategoriesList;
