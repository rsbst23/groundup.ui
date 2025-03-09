// src/utils/logger.js

/**
 * Logger utility for the application
 * Provides consistent logging with environment-aware behavior
 */

const isDevelopment = import.meta.env.MODE === 'development';

/**
 * Logs information messages
 * @param {string} message - The message to log
 * @param {any} data - Optional data to log
 */
export const logInfo = (message, data) => {
    if (isDevelopment) {
        if (data) {
            console.info(`[INFO] ${message}`, data);
        } else {
            console.info(`[INFO] ${message}`);
        }
    }
    // In production, you could send logs to a service like Sentry
};

/**
 * Logs warning messages
 * @param {string} message - The message to log
 * @param {any} data - Optional data to log
 */
export const logWarning = (message, data) => {
    if (isDevelopment) {
        if (data) {
            console.warn(`[WARNING] ${message}`, data);
        } else {
            console.warn(`[WARNING] ${message}`);
        }
    }
    // In production, you could send warnings to a service
};

/**
 * Logs error messages
 * @param {string} message - The message to log
 * @param {Error|any} error - The error object or data
 */
export const logError = (message, error) => {
    // Always log errors, even in production
    if (error instanceof Error) {
        console.error(`[ERROR] ${message}`, error.message, error.stack);
    } else if (error) {
        console.error(`[ERROR] ${message}`, error);
    } else {
        console.error(`[ERROR] ${message}`);
    }

    // In production, you could send errors to a service
};

export default {
    info: logInfo,
    warning: logWarning,
    error: logError
};