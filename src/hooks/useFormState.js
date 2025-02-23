import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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
        console.log("Updated successRedirect inside useEffect:", successRedirectRef.current);

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

    // Fix: Restore handleChange to make the text box editable
    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    // Fix: Restore validation
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

    // Fix: Restore form submission handling
    const handleSubmit = async (event) => {
        if (event) event.preventDefault(); // Prevent default form submission

        setApiError(null);

        if (!validate()) {
            return;
        }

        try {
            const response = await dispatch(submitAction(values)).unwrap();
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

        console.log("Cancel button clicked, navigating to:", successRedirectRef.current);
        navigate(successRedirectRef.current || "/application/administration/inventorycategories");
    };

    return { values, errors, apiError, handleChange, handleSubmit, handleCancel, initialized, loading };
};

export default useFormState;
