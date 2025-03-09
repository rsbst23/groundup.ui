import * as yup from 'yup';

/**
 * Common validation schemas for reuse across forms
 */
export const validationSchemas = {
    /**
     * Common text field validation
     * @param {Object} options - Configuration options
     * @param {boolean} options.required - Whether the field is required
     * @param {number} options.minLength - Minimum length
     * @param {number} options.maxLength - Maximum length
     * @param {string} options.requiredMessage - Custom required message
     * @param {string} options.minLengthMessage - Custom min length message
     * @param {string} options.maxLengthMessage - Custom max length message
     * @returns {yup.StringSchema} - Yup string schema
     */
    text: ({
        required = true,
        minLength = 0,
        maxLength = 255,
        requiredMessage = 'This field is required',
        minLengthMessage = 'This field must be at least ${min} characters',
        maxLengthMessage = 'This field cannot exceed ${max} characters'
    } = {}) => {
        let schema = yup.string().trim();

        if (required) {
            schema = schema.required(requiredMessage);
        } else {
            schema = schema.nullable();
        }

        if (minLength > 0) {
            schema = schema.min(minLength, minLengthMessage);
        }

        if (maxLength > 0) {
            schema = schema.max(maxLength, maxLengthMessage);
        }

        return schema;
    },

    /**
     * Email validation
     * @param {Object} options - Configuration options
     * @param {boolean} options.required - Whether the field is required
     * @param {string} options.requiredMessage - Custom required message
     * @param {string} options.invalidMessage - Custom invalid email message
     * @returns {yup.StringSchema} - Yup string schema
     */
    email: ({
        required = true,
        requiredMessage = 'Email is required',
        invalidMessage = 'Please enter a valid email address'
    } = {}) => {
        let schema = yup.string().trim().email(invalidMessage);

        if (required) {
            schema = schema.required(requiredMessage);
        } else {
            schema = schema.nullable();
        }

        return schema;
    },

    /**
     * Number validation
     * @param {Object} options - Configuration options
     * @param {boolean} options.required - Whether the field is required
     * @param {number} options.min - Minimum value
     * @param {number} options.max - Maximum value
     * @param {string} options.requiredMessage - Custom required message
     * @param {string} options.minMessage - Custom min value message
     * @param {string} options.maxMessage - Custom max value message
     * @param {string} options.typeMessage - Custom type message
     * @returns {yup.NumberSchema} - Yup number schema
     */
    number: ({
        required = true,
        min,
        max,
        requiredMessage = 'This field is required',
        minMessage = 'Value must be at least ${min}',
        maxMessage = 'Value cannot exceed ${max}',
        typeMessage = 'Please enter a valid number'
    } = {}) => {
        let schema = yup.number().typeError(typeMessage);

        if (required) {
            schema = schema.required(requiredMessage);
        } else {
            schema = schema.nullable();
        }

        if (min !== undefined) {
            schema = schema.min(min, minMessage);
        }

        if (max !== undefined) {
            schema = schema.max(max, maxMessage);
        }

        return schema;
    },

    /**
     * Date validation
     * @param {Object} options - Configuration options
     * @param {boolean} options.required - Whether the field is required
     * @param {Date} options.min - Minimum date
     * @param {Date} options.max - Maximum date
     * @param {string} options.requiredMessage - Custom required message
     * @param {string} options.minMessage - Custom min date message
     * @param {string} options.maxMessage - Custom max date message
     * @param {string} options.typeMessage - Custom type message
     * @returns {yup.DateSchema} - Yup date schema
     */
    date: ({
        required = true,
        min,
        max,
        requiredMessage = 'This field is required',
        minMessage = 'Date must be on or after ${min}',
        maxMessage = 'Date must be on or before ${max}',
        typeMessage = 'Please enter a valid date'
    } = {}) => {
        let schema = yup.date().typeError(typeMessage);

        if (required) {
            schema = schema.required(requiredMessage);
        } else {
            schema = schema.nullable();
        }

        if (min) {
            schema = schema.min(min, minMessage);
        }

        if (max) {
            schema = schema.max(max, maxMessage);
        }

        return schema;
    },

    /**
     * URL validation
     * @param {Object} options - Configuration options
     * @param {boolean} options.required - Whether the field is required
     * @param {string} options.requiredMessage - Custom required message
     * @param {string} options.invalidMessage - Custom invalid URL message
     * @returns {yup.StringSchema} - Yup string schema
     */
    url: ({
        required = true,
        requiredMessage = 'URL is required',
        invalidMessage = 'Please enter a valid URL'
    } = {}) => {
        let schema = yup.string().trim().url(invalidMessage);

        if (required) {
            schema = schema.required(requiredMessage);
        } else {
            schema = schema.nullable();
        }

        return schema;
    }
};

/**
 * Creates a Yup validation schema from a configuration object
 * @param {Object} schemaConfig - Object with field names as keys and validation configs as values
 * @returns {yup.ObjectSchema} - Yup object schema
 * 
 * @example
 * const schema = createValidationSchema({
 *   name: { type: 'text', required: true, maxLength: 100 },
 *   email: { type: 'email' },
 *   age: { type: 'number', min: 18, max: 120 }
 * });
 */
/**
 * Creates a Yup validation schema from a configuration object
 * @param {Object} schemaConfig - Object with field names as keys and validation configs as values
 * @param {Object} customValidations - Optional object with field names as keys and custom validation functions
 * @returns {yup.ObjectSchema} - Yup object schema
 * 
 * @example
 * const schema = createValidationSchema({
 *   name: { type: 'text', required: true, maxLength: 100 },
 *   email: { type: 'email' },
 *   age: { type: 'number', min: 18, max: 120 }
 * }, {
 *   username: (value) => value && value.length > 3 ? true : 'Username must be longer than 3 characters'
 * });
 */
export const createValidationSchema = (schemaConfig, customValidations = {}) => {
    const schemaFields = {};

    // First, create base validation schemas
    Object.entries(schemaConfig).forEach(([fieldName, config]) => {
        const { type, ...options } = config;

        if (validationSchemas[type]) {
            schemaFields[fieldName] = validationSchemas[type](options);
        } else {
            console.warn(`Validation type '${type}' not found for field '${fieldName}'`);
        }
    });

    // Then, apply any custom validations
    Object.entries(customValidations).forEach(([fieldName, validationFn]) => {
        if (schemaFields[fieldName]) {
            schemaFields[fieldName] = schemaFields[fieldName].test(
                `custom-${fieldName}`,
                'Custom validation failed',
                validationFn
            );
        } else {
            // If the field doesn't exist in schemaFields, create a basic schema
            schemaFields[fieldName] = yup.mixed().test(
                `custom-${fieldName}`,
                'Custom validation failed',
                validationFn
            );
        }
    });

    return yup.object(schemaFields);
};

/**
 * Formats API validation errors to match Yup validation error format
 * @param {Object} apiErrors - API validation errors
 * @returns {Object} - Formatted errors object
 */
export const formatApiErrors = (apiErrors) => {
    const formattedErrors = {};

    if (typeof apiErrors === 'object' && apiErrors !== null) {
        Object.entries(apiErrors).forEach(([field, errors]) => {
            // Handle array of errors or single error string
            if (Array.isArray(errors)) {
                formattedErrors[field] = errors[0];
            } else if (typeof errors === 'string') {
                formattedErrors[field] = errors;
            }
        });
    }

    return formattedErrors;
};

export default {
    validationSchemas,
    createValidationSchema,
    formatApiErrors
};