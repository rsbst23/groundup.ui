import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { parseValue } from "../utils/parseValue";
import { normalizeError, logError, createFormValidationErrors } from "../utils/errorUtils";

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
 * @param {Function} config.validate - Custom validation function
 * @returns {Object} Form state and handlers
 */
const useFormState = ({
    fetchAction,
    submitAction,
    successRedirect,
    id,
    isEditing,
    dataSelector,
    validate
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const successRedirectRef = useRef(successRedirect); // Persist successRedirect

    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
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
                        setInitialized(true); // Ensure cancel button works
                    });
            } else {
                setInitialized(true);
            }
        } else if (!isEditing && !initialized) {
            setInitialized(true);
        }
    }, [dispatch, id, isEditing, existingData, fetchAction, initialized]);

    // Handle form field changes
    const handleChange = (event) => {
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

        // Clear field-specific error when user edits the field
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Default validation function
    const defaultValidate = (dataToValidate = values) => {
        let newErrors = {};

        // Basic required field validation
        Object.entries(dataToValidate).forEach(([key, value]) => {
            // Skip validation for non-required fields or fields with values
            if (value === null || value === undefined || value === '') {
                newErrors[key] = "This field is required";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

            // Run validation - either custom or default
            const isValid = validate ? validate(trimmedValues) : defaultValidate(trimmedValues);
            if (!isValid) {
                setSubmitting(false);
                return;
            }

            // Use the trimmed values for submission
            const response = await dispatch(submitAction(trimmedValues)).unwrap();

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
                setErrors(fieldErrors);
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
        setValues(existingData || {});
        setErrors({});
        setApiError(null);
    };

    // Set individual field value
    const setFieldValue = (name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field error if it exists
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return {
        values,
        errors,
        apiError,
        handleChange,
        handleSubmit,
        handleCancel,
        resetForm,
        setFieldValue,
        initialized,
        loading,
        submitting
    };
};

export default useFormState;