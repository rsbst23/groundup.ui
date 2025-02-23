import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Generic form state management hook.
 * Supports both adding new records and editing existing ones.
 * @param {Object|null} initialValues - The initial values for the form fields.
 * @param {Function} submitAction - The Redux action to dispatch.
 * @param {string} successRedirect - The URL to navigate to on success.
 * @param {boolean} isEditing - If true, waits for initial values before enabling form.
 * @returns {Object} - Form state, validation, submission handler, and errors.
 */
const useFormState = (initialValues, submitAction, successRedirect, isEditing = false) => {
    const [values, setValues] = useState(initialValues || {}); // Default to empty object
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();
    const [initialized, setInitialized] = useState(false);

    // **Fix: Only update values on first load, and in Edit Mode, wait for API data**
    useEffect(() => {
        if (isEditing && !initialValues) return; // Wait for data to be fetched

        if (!initialized && initialValues) {
            setValues(initialValues);
            setInitialized(true);
        }
    }, [initialValues, isEditing]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let newErrors = {};
        Object.keys(values).forEach((key) => {
            if (!values[key]) {
                newErrors[key] = "This field is required";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (dispatch) => async (event) => {
        event.preventDefault();
        setApiError(null); // Reset API error

        if (!validate()) {
            return;
        }

        try {
            const response = await dispatch(submitAction(values)).unwrap();
            if (!response.success) {
                setApiError(response.message || "An error occurred.");
                return;
            }
            navigate(successRedirect);
        } catch (errorResponse) {
            setApiError(errorResponse.message || "An unexpected error occurred.");
        }
    };

    const handleCancel = () => {
        setApiError(null);
        navigate(successRedirect);
    };

    return { values, errors, apiError, handleChange, handleSubmit, handleCancel, initialized };
};

export default useFormState;
