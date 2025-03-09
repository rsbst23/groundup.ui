import dayjs from 'dayjs';

/**
 * Utility functions for handling table filters
 */

/**
 * Cleans a filters object by removing null, undefined, or empty string values
 * @param {Object} filters - The filters object to clean
 * @returns {Object} - Cleaned filters object
 */
export const cleanFilters = (filters) => {
    return Object.fromEntries(
        Object.entries(filters).filter(([_, value]) =>
            value !== null && value !== undefined && value !== ''
        )
    );
};

/**
 * Formats filter values based on their type
 * @param {string} column - The column name 
 * @param {any} value - The filter value
 * @param {string} filterType - The type of filter (text, date, number, etc.)
 * @returns {string} - Formatted filter value
 */
export const formatFilterValue = (column, value, filterType) => {
    if (value === null || value === undefined) {
        return null;
    }

    switch (filterType) {
        case 'date':
            return dayjs(value).format('YYYY-MM-DD');
        case 'number':
            return value.toString();
        default:
            return value;
    }
};

/**
 * Creates a filter object for a date range
 * @param {string} column - The column name
 * @param {Date|null} minDate - The minimum date
 * @param {Date|null} maxDate - The maximum date
 * @returns {Object} - Filter object with min and max filters
 */
export const createDateRangeFilter = (column, minDate, maxDate) => {
    const filters = {};

    if (minDate) {
        filters[`MinFilters[${column}]`] = formatFilterValue(column, minDate, 'date');
    }

    if (maxDate) {
        filters[`MaxFilters[${column}]`] = formatFilterValue(column, maxDate, 'date');
    }

    return filters;
};

/**
 * Applies a filter of the appropriate type
 * @param {Object} currentFilters - Current filters object
 * @param {string} column - Column to filter
 * @param {any} value - Filter value
 * @param {string} filterType - Type of filter
 * @returns {Object} - Updated filters object
 */
export const applyFilter = (currentFilters, column, value, filterType = 'text') => {
    let newFilters = { ...currentFilters };

    // Clear existing filters for this column
    Object.keys(newFilters).forEach(key => {
        if (key === column ||
            key === `MinFilters[${column}]` ||
            key === `MaxFilters[${column}]`) {
            delete newFilters[key];
        }
    });

    // Apply new filter value
    if (filterType === 'date' && Array.isArray(value)) {
        const [minDate, maxDate] = value;
        const dateFilters = createDateRangeFilter(column, minDate, maxDate);
        newFilters = { ...newFilters, ...dateFilters };
    } else if (value !== null && value !== '') {
        newFilters[column] = formatFilterValue(column, value, filterType);
    }

    return cleanFilters(newFilters);
};

/**
 * Creates query parameters object from table state
 * @param {Object} tableState - Table state object
 * @returns {Object} - Query parameters for API requests
 */
export const createQueryParams = (tableState) => {
    const { page, rowsPerPage, sortBy, sortDirection, filters } = tableState;

    return {
        pageNumber: page + 1, // Convert from 0-based to 1-based
        pageSize: rowsPerPage,
        sortBy,
        sortDirection,
        filters: cleanFilters(filters)
    };
};

export default {
    cleanFilters,
    formatFilterValue,
    createDateRangeFilter,
    applyFilter,
    createQueryParams
};