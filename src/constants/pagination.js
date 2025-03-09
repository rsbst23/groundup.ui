// src/constants/pagination.js
// Pagination-related constants

// Default pagination values
export const PAGINATION = {
    DEFAULT_PAGE: 0,                // First page (0-based for MUI, 1-based for API)
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
    DEFAULT_SORT_DIRECTION: 'asc',
};

// Default table settings
export const TABLE = {
    DEFAULT_SORT_FIELD: 'name',
    MAX_HEIGHT: '500px',            // Maximum height for table containers
};