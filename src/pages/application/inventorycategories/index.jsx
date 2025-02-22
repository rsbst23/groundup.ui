import useTableData from "../../../hooks/useTableData";
import DataTable from "../../../components/DataTable";
import { fetchInventoryCategories, removeInventoryCategory } from "../../../store/inventoryCategoriesSlice";

const columns = [
  { field: "name", label: "Category Name", filterable: true, filterType: "text" },
  { field: "createdDate", label: "Created Date", filterable: true, filterType: "date" }
];

const InventoryCategoriesList = () => {
  const tableProps = useTableData({
    fetchAction: fetchInventoryCategories,
    removeAction: removeInventoryCategory,
    dataSelector: (state) => ({
      items: state.inventoryCategories.categories,
      loading: state.inventoryCategories.loading,
      error: state.inventoryCategories.error,
      totalRecords: state.inventoryCategories.totalRecords,
    }),
  });

  return <DataTable {...tableProps} columns={columns} />;
};

export default InventoryCategoriesList;
