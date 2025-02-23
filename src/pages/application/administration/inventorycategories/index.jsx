import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useTableData from "../../../../hooks/useTableData";
import DataTable from "../../../../components/DataTable";
import ListPageLayout from "../../../../components/layouts/ListPageLayout";
import { usePage } from "../../../../contexts/PageContext";
import { fetchInventoryCategories, removeInventoryCategory } from "../../../../store/inventoryCategoriesSlice";
import { Link as RouterLink } from "react-router-dom";

// Define columns for the data table
const columns = [
    { field: "name", label: "Category Name", filterable: true, filterType: "text", editLink: true },
    { field: "createdDate", label: "Created Date", filterable: true, filterType: "date" },
];

const InventoryCategoriesList = () => {
    const { setPageConfig } = usePage();
    const navigate = useNavigate();

    // Set page-specific configuration
    useEffect(() => {
        const breadcrumbData = [
            { label: "Inventory Categories", path: "/application/administration/inventorycategories" }
        ];

        setPageConfig({
            title: "Inventory Categories",
            breadcrumb: breadcrumbData,
        });
    }, [setPageConfig]);

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

    return (
        <ListPageLayout
            title="Inventory Categories"
            actions={
                <Button component={RouterLink} to="add" variant="contained" color="primary">
                    Add New Category
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
