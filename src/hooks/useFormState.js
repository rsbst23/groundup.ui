import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Generic form state management hook.
 * Now includes API submission handling, error handling, and cancel handling.
 * @param {Object} initialValues - The initial values for the form fields.
 * @param {Function} submitAction - The Redux action to dispatch.
 * @param {string} successRedirect - The URL to navigate to on success.
 * @returns {Object} - Form state, validation, submission handler, and errors.
 */
const useFormState = (initialValues, submitAction, successRedirect) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();

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
            console.log("Form validation failed:", errors);
            return;
        }

        try {
            const response = await dispatch(submitAction(values)).unwrap();

            if (!response.success) {
                setApiError(response.message || "An error occurred.");
                return; // Do not navigate on failure
            }

            navigate(successRedirect); // Redirect only on success
        } catch (errorResponse) {
            setApiError(errorResponse);
        }
    };

    // Fix: Reset apiError before navigating
    const handleCancel = () => {
        setApiError(null); // Reset error before leaving page
        navigate(successRedirect);
    };

    return { values, errors, apiError, handleChange, handleSubmit, handleCancel };
};

export default useFormState;
