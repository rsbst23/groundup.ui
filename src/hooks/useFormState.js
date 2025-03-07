import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { parseValue } from "../utils/parseValue";

const useFormState = ({ fetchAction, submitAction, successRedirect, id, isEditing, dataSelector }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const successRedirectRef = useRef(successRedirect); // Persist successRedirect

    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(isEditing);
    const [initialized, setInitialized] = useState(false);

    const existingData = isEditing && dataSelector ? useSelector(dataSelector) : null;

    useEffect(() => {
        if (isEditing) {
            if (existingData) {
                setValues(existingData);
                setLoading(false);
                setInitialized(true);
            } else {
                dispatch(fetchAction(id))
                    .unwrap()
                    .then((data) => {
                        setValues(data);
                        setLoading(false);
                        setInitialized(true);
                    })
                    .catch((error) => {
                        console.error("Error fetching item:", error);
                        setApiError(error.message || "Failed to load data.");
                        setLoading(false);
                        setInitialized(true); // Ensure cancel button works
                    });
            }
        } else {
            setInitialized(true);
        }
    }, [dispatch, id, isEditing, existingData]);

    const handleChange = (event) => {
        const { name, value, type } = event.target;

        // Determine field type for parsing
        const columnType = type === "number" ? "number" : "text"; // Default to text if unknown

        setValues((prev) => ({
            ...prev,
            [name]: parseValue(value, columnType)
        }));
    };

    const validate = (dataToValidate = values) => {
        let newErrors = {};
        Object.keys(dataToValidate).forEach((key) => {
            if (!dataToValidate[key]) {
                newErrors[key] = "This field is required";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        if (event) event.preventDefault(); // Prevent default form submission
        setApiError(null);

        // Create a trimmed copy of the values for submission
        const trimmedValues = Object.fromEntries(
            Object.entries(values).map(([key, value]) => {
                // Only trim string values
                return [key, typeof value === 'string' ? value.trim() : value];
            })
        );

        if (!validate(trimmedValues)) {
            return;
        }

        try {
            // Use the trimmed values for submission
            const response = await dispatch(submitAction(trimmedValues)).unwrap();
            if (!response.success) {
                setApiError(response.message || "An error occurred.");
                return;
            }
            navigate(successRedirectRef.current);
        } catch (errorResponse) {
            setApiError(errorResponse.message || "An unexpected error occurred.");
        }
    };

    // Ensure cancel button always works
    const handleCancel = (event) => {
        if (event) event.preventDefault();
        setApiError(null);

        navigate(successRedirectRef.current || "/application/administration/inventorycategories");
    };

    return { values, errors, apiError, handleChange, handleSubmit, handleCancel, initialized, loading };
};

export default useFormState;
