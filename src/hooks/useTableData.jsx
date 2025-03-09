import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { normalizeError, logError } from "../utils/errorUtils";

/**
 * Custom hook for handling data tables with sorting, pagination, and filtering
 * 
 * @param {Object} config - Configuration object
 * @param {Function} config.fetchAction - Redux action to fetch the data
 * @param {Function} config.removeAction - Redux action to remove items
 * @param {Function} config.dataSelector - Redux selector to get the data
 * @param {string} config.defaultSort - Default sort column
 * @param {string} config.contextName - Name for error logging context
 * @returns {Object} Table state and handlers
 */
const useTableData = ({
    fetchAction,
    removeAction,
    dataSelector,
    defaultSort = "Name",
    contextName = "TableData"
}) => {
    const dispatch = useDispatch();
    const logContext = `useTableData:${contextName}`;

    // Get data from Redux store
    const selectedData = useSelector(dataSelector, (prev, next) =>
        JSON.stringify(prev) === JSON.stringify(next)
    );

    // Track initialization and user interaction
    const firstFetchComplete = useRef(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    // Table state
    const [page, setPage] = useState(0); // UI uses 0-based, API uses 1-based
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState(defaultSort);
    const [sortDirection, setSortDirection] = useState("asc");
    const [filters, setFilters] = useState({});
    const [localError, setLocalError] = useState(null);

    // Initial data fetch
    useEffect(() => {
        if (!firstFetchComplete.current) {
            firstFetchComplete.current = true;
            fetchData();
        }
    }, []);

    // Fetch data when parameters change
    useEffect(() => {
        if (firstFetchComplete.current && hasUserInteracted) {
            fetchData();
        }
    }, [page, rowsPerPage, sortBy, sortDirection, filters, hasUserInteracted]);

    // Enhance error with context information
    const enhanceErrorWithContext = (error) => {
        const normalizedError = normalizeError(error);

        // Add context information to the error
        normalizedError.context = contextName;

        // Add operation details to help with debugging
        normalizedError.operationDetails = {
            component: contextName,
            operation: 'fetchData',
            parameters: {
                pageNumber: page + 1,
                pageSize: rowsPerPage,
                sortBy: sortDirection === "desc" ? `-${sortBy}` : sortBy,
                filterCount: Object.keys(filters).length
            }
        };

        return normalizedError;
    };

    // Fetch data from the API
    const fetchData = async () => {
        try {
            setLocalError(null);
            await dispatch(
                fetchAction({
                    pageNumber: page + 1, // Convert to 1-based for API
                    pageSize: rowsPerPage,
                    sortBy: sortDirection === "desc" ? `-${sortBy}` : sortBy,
                    filters,
                })
            ).unwrap();
        } catch (error) {
            const enhancedError = enhanceErrorWithContext(error);
            logError(logContext, enhancedError);
            setLocalError(enhancedError);
        } finally {
            setInitialLoading(false);
        }
    };

    // Handle column sorting
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
        setHasUserInteracted(true);
    };

    // Handle page change
    const handlePageChange = (_, newPage) => {
        setPage(newPage);
        setHasUserInteracted(true);
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
        setHasUserInteracted(true);
    };

    // Handle item deletion
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        try {
            setLocalError(null);
            await dispatch(removeAction(id)).unwrap();
            await fetchData(); // Refresh data after deletion
        } catch (error) {
            const enhancedError = {
                ...enhanceErrorWithContext(error),
                operationDetails: {
                    component: contextName,
                    operation: 'deleteItem',
                    itemId: id
                }
            };
            logError(`${logContext}:delete`, enhancedError);
            setLocalError(enhancedError);
        }
    };

    // Handle filter application
    const handleFilterApply = (newFilters) => {
        // Clean up filters by removing null/undefined values
        const cleanFilters = Object.fromEntries(
            Object.entries(newFilters)
                .filter(([_, value]) => value !== null && value !== undefined)
        );

        setFilters(cleanFilters);
        setPage(0); // Reset to first page when filters change
        setHasUserInteracted(true);
    };

    // Combine library error and local error
    const error = selectedData.error ? enhanceErrorWithContext(selectedData.error) : localError;

    // Return memoized state and handlers
    return useMemo(() => ({
        data: Array.isArray(selectedData.items) ? selectedData.items : [],
        loading: selectedData.loading || initialLoading,
        error,
        contextName,
        totalRecords: selectedData.totalRecords || 0,
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
        refreshData: fetchData,
    }), [
        selectedData,
        page,
        rowsPerPage,
        sortBy,
        sortDirection,
        filters,
        error,
        initialLoading
    ]);
};

export default useTableData;