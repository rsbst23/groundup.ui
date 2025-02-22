import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const useTableData = ({ fetchAction, removeAction, dataSelector, defaultSort = "Name" }) => {
    const dispatch = useDispatch();

    const selectedData = useSelector((state) => {
        const data = dataSelector(state);
        return {
            items: data?.items ?? [],
            loading: data?.loading ?? false,
            error: data?.error ?? null,
            totalRecords: data?.totalRecords ?? 0,
        };
    });

    const firstFetchComplete = useRef(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [page, setPage] = useState(0); // UI uses 0-based, API uses 1-based
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState(defaultSort);
    const [sortDirection, setSortDirection] = useState("asc");
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
        console.log("Fetching data with:", { pageNumber: page + 1, pageSize: rowsPerPage, sortBy, filters });
        try {
            const response = await dispatch(
                fetchAction({
                    pageNumber: page + 1,
                    pageSize: rowsPerPage,
                    sortBy: sortDirection === "desc" ? `-${sortBy}` : sortBy,
                    filters,
                })
            ).unwrap();
            console.log("useTableData - API Response:", response);
            console.log("useTableData - Extracted items:", response?.data?.items || []);
            setInitialLoading(false);
        } catch (error) {
            console.error("useTableData - Fetch error:", error);
        }
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
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

    return useMemo(
        () => ({
            data: selectedData.items,
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
        }),
        [selectedData, page, rowsPerPage, sortBy, sortDirection, filters]
    );
};

export default useTableData;
