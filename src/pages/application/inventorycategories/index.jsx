import React, { useEffect } from "react";
import { Button } from "@mui/material";
import useTableData from "../../../hooks/useTableData";
import DataTable from "../../../components/DataTable";
import ListPageLayout from "../../../components/layouts/ListPageLayout";
import { usePage } from "../../../contexts/PageContext";
import { fetchInventoryCategories, removeInventoryCategory } from "../../../store/inventoryCategoriesSlice";

const columns = [
    { field: "name", label: "Category Name", filterable: true, filterType: "text" },
    { field: "createdDate", label: "Created Date", filterable: true, filterType: "date" },
];

const InventoryCategoriesList = () => {
    const { setPageConfig } = usePage();
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

    useEffect(() => {
        setPageConfig({
            title: "Inventory Categories",
            breadcrumb: "Inventory Categories"
        });
    }, [setPageConfig]);

    return (
        <ListPageLayout
            title="Inventory Categories"
            actions={
                <Button variant="contained" color="primary">
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
