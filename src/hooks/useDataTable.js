import { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { PAGINATION } from '../constants/pagination';
import { cleanFilters, applyFilter, createQueryParams } from '../utils/tableFilters';

/**
 * Custom hook to manage data table state with Redux integration
 */
const useDataTable = ({
    fetchAction,
    removeAction,
    exportAction = null, // New parameter for the export action
    dataSelector,
    defaultSort = 'id',
    defaultSortDirection = 'asc',
    defaultPage = 0,
    defaultRowsPerPage = PAGINATION.DEFAULT_PAGE_SIZE,
    defaultFilters = {},
    contextName = 'DataTable'
}) => {
    const dispatch = useDispatch();
    const isFirstRender = useRef(true);

    // Local UI state
    const [page, setPage] = useState(defaultPage);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [sortBy, setSortBy] = useState(defaultSort);
    const [sortDirection, setSortDirection] = useState(defaultSortDirection);
    const [filters, setFilters] = useState(defaultFilters);

    // Filter UI state
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);
    const [tempTextFilter, setTempTextFilter] = useState('');
    const [tempMinDate, setTempMinDate] = useState(null);
    const [tempMaxDate, setTempMaxDate] = useState(null);

    // Select data from Redux store
    const { items, loading, error, totalRecords } = useSelector(dataSelector);

    // Current table state
    const tableState = {
        page,
        rowsPerPage,
        sortBy,
        sortDirection,
        filters
    };

    // Event handlers
    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const handleSort = useCallback((field) => {
        const isAsc = sortBy === field && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortBy(field);
    }, [sortBy, sortDirection]);

    const handleDelete = useCallback((id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            dispatch(removeAction(id));
        }
    }, [dispatch, removeAction]);

    // Filter handlers
    const handleFilterIconClick = useCallback((event, column, columnDef) => {
        setActiveFilterColumn(column);
        setFilterAnchor(event.currentTarget);
        const filterType = columnDef?.filterType || 'text';

        if (filterType === 'date') {
            setTempMinDate(filters[`MinFilters[${column}]`] ? dayjs(filters[`MinFilters[${column}]`]) : null);
            setTempMaxDate(filters[`MaxFilters[${column}]`] ? dayjs(filters[`MaxFilters[${column}]`]) : null);
        } else {
            setTempTextFilter(filters[column] || '');
        }
    }, [filters]);

    const handleFilterClose = useCallback(() => {
        setFilterAnchor(null);
        setActiveFilterColumn(null);
        setTempTextFilter('');
        setTempMinDate(null);
        setTempMaxDate(null);
    }, []);

    const applyTableFilter = useCallback(() => {
        if (!activeFilterColumn) return;

        const filterType = activeFilterColumn.includes('Date') ? 'date' : 'text';
        let newFilters;

        if (filterType === 'date') {
            newFilters = applyFilter(
                filters,
                activeFilterColumn,
                [tempMinDate, tempMaxDate],
                'date'
            );
        } else {
            newFilters = applyFilter(
                filters,
                activeFilterColumn,
                tempTextFilter,
                'text'
            );
        }

        handleFilterApply(newFilters);
        handleFilterClose();
    }, [activeFilterColumn, filters, tempMinDate, tempMaxDate, tempTextFilter, handleFilterClose]);

    const clearFilter = useCallback(() => {
        if (!activeFilterColumn) return;

        let newFilters = { ...filters };
        const filterType = activeFilterColumn.includes('Date') ? 'date' : 'text';

        if (filterType === 'date') {
            delete newFilters[`MinFilters[${activeFilterColumn}]`];
            delete newFilters[`MaxFilters[${activeFilterColumn}]`];
        } else {
            delete newFilters[activeFilterColumn];
        }

        handleFilterApply(cleanFilters(newFilters));
        handleFilterClose();
    }, [activeFilterColumn, filters, handleFilterClose]);

    const handleFilterApply = useCallback((newFilters) => {
        setFilters(newFilters);
        setPage(0); // Reset to first page when applying filters
    }, []);

    // Reset all filters
    const resetFilters = useCallback(() => {
        setFilters({});
        setPage(0);
    }, []);

    // Enhanced exportData function that uses the provided exportAction if available
    const exportData = useCallback((format = 'csv') => {
        const params = {
            format,
            filters,
            sortBy,
            sortDirection
        };

        // If an export action was provided, dispatch it with the params
        if (exportAction) {
            dispatch(exportAction(params));
        }

        // Always return the params for cases where the component needs them
        return params;
    }, [dispatch, exportAction, filters, sortBy, sortDirection]);

    // FIX: Use refs to track previous state and prevent infinite loops
    const lastStateRef = useRef({
        page: defaultPage,
        rowsPerPage: defaultRowsPerPage,
        sortBy: defaultSort,
        sortDirection: defaultSortDirection,
        filtersString: JSON.stringify(defaultFilters)
    });

    // Fetch data when parameters change
    useEffect(() => {
        // Convert filters to string for comparison
        const filtersString = JSON.stringify(filters);

        // Only fetch if something actually changed
        const lastState = lastStateRef.current;
        const hasChanged =
            page !== lastState.page ||
            rowsPerPage !== lastState.rowsPerPage ||
            sortBy !== lastState.sortBy ||
            sortDirection !== lastState.sortDirection ||
            filtersString !== lastState.filtersString;

        if (isFirstRender.current || hasChanged) {
            isFirstRender.current = false;

            // Update the ref to the current state
            lastStateRef.current = {
                page,
                rowsPerPage,
                sortBy,
                sortDirection,
                filtersString
            };

            // Create tableState object here to avoid stale closure
            const currentTableState = {
                page,
                rowsPerPage,
                sortBy,
                sortDirection,
                filters
            };

            // Fetch data using the tableFilters utility
            dispatch(fetchAction(createQueryParams(currentTableState)));
        }
    }, [dispatch, fetchAction, page, rowsPerPage, sortBy, sortDirection, filters]);

    return {
        // Data
        data: items,
        loading,
        error,
        totalRecords,
        contextName,

        // State
        page,
        rowsPerPage,
        sortBy,
        sortDirection,
        filters,

        // Filter UI state
        filterAnchor,
        activeFilterColumn,
        tempTextFilter,
        tempMinDate,
        tempMaxDate,

        // Event handlers
        onPageChange: handlePageChange,
        onRowsPerPageChange: handleRowsPerPageChange,
        onSort: handleSort,
        onDelete: handleDelete,
        onFilterApply: handleFilterApply,
        handleFilterIconClick,
        handleFilterClose,
        applyFilter: applyTableFilter,
        clearFilter,
        resetFilters,
        exportData, // Enhanced export function

        // UI state setters
        setTempTextFilter,
        setTempMinDate,
        setTempMaxDate,
    };
};

export default useDataTable;