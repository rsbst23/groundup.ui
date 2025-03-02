import dayjs from "dayjs";

// Default formats
const DATE_FORMAT = "YYYY-MMM-DD";
const DATETIME_FORMAT = "YYYY-MMM-DD HH:mm:ss";
const CURRENCY_FORMAT = "USD"; // Change this if needed
const NUMBER_DECIMALS = 2; // Default decimal places for numbers

export const formatValue = (value, type = "text") => {
    if (value === null || value === undefined) return ""; // Handle empty values gracefully

    switch (type) {
        case "date":
            return dayjs(value).format(DATE_FORMAT);
        case "datetime":
            return dayjs(value).format(DATETIME_FORMAT);
        case "currency":
            return new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY_FORMAT }).format(value);
        case "number":
            return new Intl.NumberFormat("en-US", { minimumFractionDigits: NUMBER_DECIMALS }).format(value);
        case "boolean":
            return value ? "Yes" : "No";
        case "text":
        default:
            return String(value); // Default: Convert to string
    }
};