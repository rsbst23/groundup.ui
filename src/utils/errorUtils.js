/**
 * Utility functions for standardized error handling throughout the application
 */

/**
 * Normalizes error objects from different sources into a consistent format
 * @param {Error|Object|string} error - The error to normalize
 * @returns {Object} Normalized error object with message, errors array, and statusCode
 */
export const normalizeError = (error) => {
    // Default error structure
    const normalized = {
        message: "An unexpected error occurred.",
        errors: [],
        statusCode: 500
    };

    if (!error) {
        return normalized;
    }

    // Handle string errors
    if (typeof error === 'string') {
        return {
            ...normalized,
            message: error
        };
    }

    // Handle Error objects
    if (error instanceof Error) {
        return {
            ...normalized,
            message: error.message || normalized.message
        };
    }

    // Handle API response errors
    if (typeof error === 'object') {
        return {
            message: error.message || normalized.message,
            errors: Array.isArray(error.errors) ? error.errors : (error.errors ? [error.errors] : []),
            statusCode: error.statusCode || error.status || normalized.statusCode,
            data: error.data
        };
    }

    return normalized;
};

/**
 * Extracts a user-friendly error message from various error formats
 * @param {Error|Object|string} error - The error to process
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
    const normalized = normalizeError(error);

    // First check if there are specific error messages in the errors array
    if (normalized.errors && normalized.errors.length > 0) {
        // Return the first specific error
        return normalized.errors[0];
    }

    // Otherwise fall back to the general message
    return normalized.message || "An unexpected error occurred.";
};

/**
 * Determines if an error is a validation error (typically 400 status code)
 * @param {Error|Object|string} error - The error to check
 * @returns {boolean} True if the error is a validation error
 */
export const isValidationError = (error) => {
    const normalized = normalizeError(error);
    return normalized.statusCode === 400;
};

/**
 * Determines if an error is an authentication error (typically 401 status code)
 * @param {Error|Object|string} error - The error to check
 * @returns {boolean} True if the error is an authentication error
 */
export const isAuthError = (error) => {
    const normalized = normalizeError(error);
    return normalized.statusCode === 401;
};

/**
 * Determines if an error is a server error (500+ status codes)
 * @param {Error|Object|string} error - The error to check
 * @returns {boolean} True if the error is a server error
 */
export const isServerError = (error) => {
    const normalized = normalizeError(error);
    return normalized.statusCode >= 500;
};

/**
 * Creates a form validation error object suitable for use with form libraries
 * @param {Object} errorData - Error data from API
 * @returns {Object} Field-keyed validation errors
 */
export const createFormValidationErrors = (errorData) => {
    const normalized = normalizeError(errorData);
    const fieldErrors = {};

    if (normalized.data && typeof normalized.data === 'object') {
        // Handle field-specific errors from the API
        Object.entries(normalized.data).forEach(([field, errors]) => {
            fieldErrors[field] = Array.isArray(errors) ? errors[0] : errors;
        });
    }

    return fieldErrors;
};

/**
 * Logs errors to the console with useful context
 * @param {string} context - Where the error occurred (e.g., "LoginPage", "ApiService")
 * @param {Error|Object|string} error - The error that occurred
 */
export const logError = (context, error) => {
    const normalized = normalizeError(error);
    console.error(`[${context}] Error:`, normalized.message, error);
};