import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { parseValue } from "../utils/parseValue";
import { normalizeError, logError, createFormValidationErrors } from "../utils/errorUtils";
import * as yup from "yup";

/**
 * Custom hook for managing form state including validation and error handling
 * 
 * @param {Object} config - Configuration object
 * @param {Function} config.fetchAction - Redux action to fetch data (for edit forms)
 * @param {Function} config.submitAction - Redux action to submit the form
 * @param {string} config.successRedirect - Path to redirect to on success
 * @param {string|number} config.id - ID of the item to fetch (for edit forms)
 * @param {boolean} config.isEditing - Whether this is an edit form
 * @param {Function} config.dataSelector - Redux selector to get data for the form
 * @param {Object} config.validationSchema - Yup validation schema
 * @param {Function} config.onBeforeSubmit - Function to run before submission
 * @param {Object} config.initialValues - Initial values for the form (for create forms)
 * @returns {Object} Form state and handlers
 */
const useFormState = ({
    fetchAction,
    submitAction,
    successRedirect,
    id,
    isEditing,
    dataSelector,
    validationSchema,
    onBeforeSubmit,
    initialValues = {}
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const successRedirectRef = useRef(successRedirect);

    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(isEditing);
    const [initialized, setInitialized] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const existingData = isEditing && dataSelector ? useSelector(dataSelector) : null;

    // Fetch data for edit forms
    useEffect(() => {
        if (isEditing && !initialized) {
            const context = `useFormState:fetch:${id}`;

            if (existingData) {
                setValues(existingData);
                setLoading(false);
                setInitialized(true);
            } else if (fetchAction) {
                setLoading(true);

                dispatch(fetchAction(id))
                    .unwrap()
                    .then((data) => {
                        setValues(data);
                        setLoading(false);
                        setInitialized(true);
                    })
                    .catch((error) => {
                        const normalizedError = normalizeError(error);
                        logError(context, normalizedError);
                        setApiError(normalizedError);
                        setLoading(false);
                        setInitialized(true);
                    });
            } else {
                setInitialized(true);
            }
        } else if (!isEditing && !initialized) {
            setInitialized(true);
        }
    }, [dispatch, id, isEditing, existingData, fetchAction, initialized]);

    // Validate a single field
    const validateField = async (name, value) => {
        if (!validationSchema || !validationSchema.fields[name]) return null;

        try {
            await yup.reach(validationSchema, name).validate(value);
            return null;
        } catch (error) {
            return error.message;
        }
    };

    // Validate the entire form
    const validateForm = async (dataToValidate = values) => {
        if (!validationSchema) return true;

        try {
            await validationSchema.validate(dataToValidate, { abortEarly: false });
            setErrors({});
            return true;
        } catch (validationError) {
            const newErrors = {};

            if (validationError.inner) {
                validationError.inner.forEach(error => {
                    newErrors[error.path] = error.message;
                });
            }

            setErrors(newErrors);
            return false;
        }
    };

    // Handle input blur for field-level validation
    // This will mark fields as touched and show validation errors
    // but won't prevent navigation between fields
    const handleBlur = async (event) => {
        const { name } = event.target;

        // Mark the field as touched
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Validate and update errors, but don't prevent the blur event
        const fieldError = await validateField(name, values[name]);
        if (fieldError) {
            setErrors(prev => ({
                ...prev,
                [name]: fieldError
            }));
        } else if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Handle form field changes
    const handleChange = async (event) => {
        const { name, value, type, checked } = event.target;

        // Handle different input types
        let parsedValue;
        if (type === "checkbox") {
            parsedValue = checked;
        } else {
            // Determine field type for parsing
            const columnType = type === "number" ? "number" : "text";
            parsedValue = parseValue(value, columnType);
        }

        setValues((prev) => ({
            ...prev,
            [name]: parsedValue
        }));

        // Validate field if it has been touched
        if (touched[name]) {
            const fieldError = await validateField(name, parsedValue);
            if (fieldError) {
                setErrors(prev => ({
                    ...prev,
                    [name]: fieldError
                }));
            } else if (errors[name]) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        if (event) event.preventDefault();
        setApiError(null);
        setSubmitting(true);
        const context = `useFormState:submit:${isEditing ? 'update' : 'create'}`;

        try {
            // Create a trimmed copy of the values for submission
            const trimmedValues = Object.fromEntries(
                Object.entries(values).map(([key, value]) => {
                    // Only trim string values
                    return [key, typeof value === 'string' ? value.trim() : value];
                })
            );

            // Mark all fields as touched for validation
            const allTouched = Object.keys(trimmedValues).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {});
            setTouched(allTouched);

            // Run validation
            const isValid = await validateForm(trimmedValues);
            if (!isValid) {
                setSubmitting(false);
                // Show a more user-friendly message when validation fails
                setApiError({
                    message: "Please correct the highlighted fields before submitting",
                    details: "There are validation errors in the form"
                });
                return { success: false, error: { message: "Validation failed" } };
            }

            // Run onBeforeSubmit hook if provided
            let dataToSubmit = trimmedValues;
            if (onBeforeSubmit) {
                dataToSubmit = onBeforeSubmit(trimmedValues);
            }

            // Submit the form
            const response = await dispatch(submitAction(dataToSubmit)).unwrap();

            // Handle successful submission
            setSubmitting(false);
            navigate(successRedirectRef.current);
            return response;
        } catch (error) {
            const normalizedError = normalizeError(error);
            logError(context, normalizedError);

            // Check for validation errors from the API
            if (normalizedError.statusCode === 400 && normalizedError.data) {
                const fieldErrors = createFormValidationErrors(normalizedError);
                setErrors(prev => ({
                    ...prev,
                    ...fieldErrors
                }));
            }

            setApiError(normalizedError);
            setSubmitting(false);
            return { success: false, error: normalizedError };
        }
    };

    // Handle form cancellation
    const handleCancel = (event) => {
        if (event) event.preventDefault();
        setApiError(null);
        navigate(successRedirectRef.current || "/");
    };

    // Reset form to initial values or empty
    const resetForm = () => {
        setValues(existingData || initialValues);
        setErrors({});
        setTouched({});
        setApiError(null);
    };

    // Set individual field value
    const setFieldValue = async (name, value, shouldValidate = true) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));

        if (shouldValidate && touched[name]) {
            const fieldError = await validateField(name, value);
            if (fieldError) {
                setErrors(prev => ({
                    ...prev,
                    [name]: fieldError
                }));
            } else if (errors[name]) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        }
    };

    // Set multiple field values at once
    const setMultipleFields = async (fieldsObject, shouldValidate = true) => {
        setValues(prev => ({
            ...prev,
            ...fieldsObject
        }));

        if (shouldValidate) {
            const newValues = { ...values, ...fieldsObject };
            validateForm(newValues);
        }
    };

    // Helper functions for form status
    const isFieldValid = (fieldName) => {
        return !(touched[fieldName] && errors[fieldName]);
    };

    const hasErrors = () => {
        return Object.keys(errors).length > 0;
    };

    const touchAllFields = () => {
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);
    };

    const clearErrors = () => {
        setErrors({});
    };

    return {
        values,
        errors,
        touched,
        apiError,
        handleChange,
        handleBlur,
        handleSubmit,
        handleCancel,
        resetForm,
        setFieldValue,
        setMultipleFields,
        validateField,
        validateForm,
        initialized,
        loading,
        submitting,
        // Additional helper functions
        isFieldValid,
        hasErrors,
        touchAllFields,
        clearErrors
    };
};

export default useFormState;