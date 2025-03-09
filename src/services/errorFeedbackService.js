import apiService from './apiService';
import { normalizeError, logError } from '../utils/errorUtils';

/**
 * Check if we're in development mode
 * This is browser-safe compared to using process.env directly
 */
const isDevelopment = () => {
    // Check if we have import.meta.env (Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env.MODE === 'development' || import.meta.env.DEV === true;
    }

    // Check if we have window.__ENV__ (custom environment injection)
    if (typeof window !== 'undefined' && window.__ENV__) {
        return window.__ENV__.NODE_ENV === 'development';
    }

    // Default to production for safety
    return false;
};

// Define the resource path to match your API controller structure
const RESOURCE = "feedback";

/**
 * Extract context from error object or provided context
 * @param {Object} error - The error object
 * @param {string} providedContext - Context provided directly to the service
 * @returns {string} - The most specific context available
 */
const extractContext = (error, providedContext) => {
    // Check for context in various places with most specific first
    if (providedContext && providedContext !== 'unknown') {
        return providedContext;
    }

    if (error && typeof error === 'object') {
        // Check for context directly in the error
        if (error.context && error.context !== 'unknown') {
            return error.context;
        }

        // Check in the operationDetails if available
        if (error.operationDetails && error.operationDetails.component) {
            return error.operationDetails.component;
        }
    }

    // Default fallback
    return 'frontend';
};

/**
 * Properly format error details to match the ErrorDetailsDto structure in C#
 * @param {Object} error - The error object from UI
 * @returns {Object} - Formatted error details matching DTO structure
 */
const formatErrorForDto = (error) => {
    if (!error) {
        return {
            Message: "Unknown error",
            Name: "Error",
            Stack: null,
            ComponentStack: null
        };
    }

    // Start with basic structure that matches ErrorDetailsDto
    const formattedError = {
        Message: error.message || "Unknown error",
        Name: error.name || "Error",
        Stack: error.stack || null,
        ComponentStack: error.componentStack || null
    };

    // Include any additional technical details as a JSON string in the Stack field
    // This ensures all error information is preserved regardless of structure
    if (typeof error === 'object') {
        // Combine all properties into a detailed technical information string
        let technicalDetails = "Technical Details:\n";

        // Add context if available
        if (error.context) {
            technicalDetails += `Context: ${error.context}\n`;
        }

        // Add operation details if available
        if (error.operationDetails) {
            technicalDetails += `Operation: ${error.operationDetails.operation || 'unknown'}\n`;
            if (error.operationDetails.parameters) {
                technicalDetails += `Parameters: ${JSON.stringify(error.operationDetails.parameters)}\n`;
            }
        }

        // Add message and basic properties
        technicalDetails += `Message: ${error.message || 'Unknown error'}\n`;
        technicalDetails += `Status Code: ${error.statusCode || 'N/A'}\n`;

        // Include errors array if present
        if (error.errors && Array.isArray(error.errors)) {
            technicalDetails += `Errors: ${error.errors.join(', ')}\n`;
        }

        // Include detailed data object if present
        if (error.data) {
            technicalDetails += `Data Details:\n`;
            technicalDetails += JSON.stringify(error.data, null, 2);
        } else {
            // Try to include full error serialization as fallback
            try {
                const errorStr = JSON.stringify(error, (key, value) => {
                    // Skip functions and circular references
                    if (typeof value === 'function') {
                        return '[Function]';
                    }
                    return value;
                }, 2);

                technicalDetails += `Full Error Object:\n${errorStr}`;
            } catch (e) {
                // If JSON stringify fails, include what we can
                technicalDetails += `Error properties: ${Object.keys(error).join(', ')}`;
            }
        }

        // Add this comprehensive technical details to the Stack field if no stack trace exists
        if (!formattedError.Stack) {
            formattedError.Stack = technicalDetails;
        } else {
            // Append to existing stack trace
            formattedError.Stack += "\n\n" + technicalDetails;
        }
    }

    return formattedError;
};

/**
 * Service for handling error feedback submission
 */
const errorFeedbackService = {
    /**
     * Submit user feedback about an error
     * 
     * @param {Object} feedbackData - The feedback data
     * @param {string} feedbackData.feedback - User description of what happened
     * @param {string} feedbackData.email - Optional user email for follow-up
     * @param {Object} feedbackData.error - Error object
     * @param {string} feedbackData.context - Where the error occurred
     * @param {string} feedbackData.timestamp - When the error occurred
     * @param {string} feedbackData.url - Page URL when the error occurred
     * @param {string} feedbackData.userAgent - Browser info
     * @returns {Promise<Object>} Response from the server
     */
    submit: async (feedbackData) => {
        try {
            // Extract the most specific context available
            const errorContext = extractContext(feedbackData.error, feedbackData.context);

            console.log('Context from error:', feedbackData.error?.context);
            console.log('Provided context:', feedbackData.context);
            console.log('Using context:', errorContext);

            // Format the data to match the C# DTO structure
            const formattedData = {
                feedback: feedbackData.feedback,
                email: feedbackData.email || null,
                context: errorContext,
                error: formatErrorForDto(feedbackData.error),
                url: feedbackData.url || window.location.href,
                userAgent: feedbackData.userAgent || navigator.userAgent,
                timestamp: feedbackData.timestamp || new Date().toISOString()
            };

            console.log('Sending error feedback payload:', formattedData);

            // Use the create method to submit the feedback data
            const response = await apiService.create(RESOURCE + "/error", formattedData);
            return response;
        } catch (error) {
            // If the API call fails, we can fall back to other methods

            // Fallback 1: Send to an error monitoring service if available
            // This would be your integration with Sentry, LogRocket, etc.

            // Fallback 2: Log to console in development
            if (isDevelopment()) {
                console.group('Error Feedback (API Failed)');
                console.log('Feedback:', feedbackData.feedback);
                console.log('User Email:', feedbackData.email);
                console.log('Error:', feedbackData.error);
                console.log('Context:', feedbackData.context);
                console.log('Timestamp:', feedbackData.timestamp);
                console.log('URL:', feedbackData.url);
                console.log('User Agent:', feedbackData.userAgent);
                console.groupEnd();
            }

            const normalizedError = normalizeError(error);
            logError('ErrorFeedbackService', normalizedError);

            // For development or if we can't reach the server,
            // we'll simulate success to give the user a good experience
            if (isDevelopment()) {
                return {
                    success: true,
                    message: 'Feedback logged to console (development mode)'
                };
            }

            throw normalizedError;
        }
    },

    /**
     * Mock implementation for development/testing
     * Remove this in production or when you have a real backend endpoint
     */
    submitMock: async (feedbackData) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.group('Error Feedback (Mock)');
        console.log('Feedback:', feedbackData.feedback);
        console.log('User Email:', feedbackData.email);
        console.log('Error:', feedbackData.error);
        console.log('Context:', feedbackData.context);
        console.log('Timestamp:', feedbackData.timestamp);
        console.log('URL:', feedbackData.url);
        console.log('User Agent:', feedbackData.userAgent);
        console.groupEnd();

        return {
            success: true,
            message: 'Feedback submitted successfully (mock)'
        };
    }
};

// Choose which implementation to use based on environment
// Use isDevelopment() instead of process.env
const useMockApi = isDevelopment() && (
    // Check various ways the USE_MOCK_API flag might be set
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_USE_MOCK_API === 'true') ||
    (typeof window !== 'undefined' && window.__ENV__?.USE_MOCK_API === 'true')
);

const service = useMockApi
    ? { ...errorFeedbackService, submit: errorFeedbackService.submitMock }
    : errorFeedbackService;

export default service;