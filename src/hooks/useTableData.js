import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PAGINATION, TABLE } from "../constants/pagination";

const useTableData = ({ fetchAction, removeAction, dataSelector, defaultSort = TABLE.DEFAULT_SORT_FIELD }) => {
    const dispatch = useDispatch();

    const selectedData = useSelector(useMemo(() => dataSelector, []), (prev, next) => JSON.stringify(prev) === JSON.stringify(next));

    const firstFetchComplete = useRef(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
    const [sortBy, setSortBy] = useState(defaultSort);
    const [sortDirection, setSortDirection] = useState(PAGINATION.DEFAULT_SORT_DIRECTION);
    const [filters, setFilters] = useState({});
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    useEffect(() => {
        if (!firstFetchComplete.current) {
            firstFetchComplete.current = true;
            fetchData();
        }
    }, []);

    useEffect(() => {
        if (firstFetchComplete.current && hasUserInteracted) {
            fetchData();
        }
    }, [page, rowsPerPage, sortBy, sortDirection, filters, hasUserInteracted]);

    const fetchData = async () => {
        try {
            await dispatch(
                fetchAction({
                    pageNumber: page + 1,
                    pageSize: rowsPerPage,
                    // Capitalize the first letter of sortBy
                    sortBy: sortDirection === "desc"
                        ? `-${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}`
                        : sortBy.charAt(0).toUpperCase() + sortBy.slice(1),
                    filters,
                })
            ).unwrap();
        } catch (error) {
            console.error("Error fetching table data:", error);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection(PAGINATION.DEFAULT_SORT_DIRECTION);
        }
        setHasUserInteracted(true);
    };

    const handlePageChange = (_, newPage) => {
        setPage(newPage);
        setHasUserInteracted(true);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setHasUserInteracted(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            await dispatch(removeAction(id)).unwrap();
            fetchData();
        }
    };

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters);
        setHasUserInteracted(true);
    };

    return useMemo(() => ({
        data: selectedData.items, // Ensured this is always an array
        loading: selectedData.loading,
        error: selectedData.error,
        totalRecords: selectedData.totalRecords,
        page,
        rowsPerPage,
        sortBy,
        sortDirection,
        filters,
        onSort: handleSort,
        onPageChange: handlePageChange,
        onRowsPerPageChange: handleRowsPerPageChange,
        onDelete: handleDelete,
        onFilterApply: handleFilterApply,
    }), [selectedData, page, rowsPerPage, sortBy, sortDirection, filters]);
};

export default useTableData;