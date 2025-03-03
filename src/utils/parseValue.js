import dayjs from "dayjs";

// Define expected input formats
const DATE_INPUT_FORMAT = "YYYY-MM-DD";
const DATETIME_INPUT_FORMAT = "YYYY-MM-DDTHH:mm:ss"; // ISO Format
const CURRENCY_REGEX = /[^0-9.-]+/g; // Remove currency symbols
const NUMBER_REGEX = /[^0-9.-]/g; // Remove non-numeric characters

export const parseValue = (value, type = "text") => {
    if (value === null || value === undefined) return null; // Ensure null safety

    switch (type) {
        case "date":
            return dayjs(value, DATE_INPUT_FORMAT, true).isValid() ? dayjs(value).format(DATE_INPUT_FORMAT) : null;
        case "datetime":
            return dayjs(value, DATETIME_INPUT_FORMAT, true).isValid() ? dayjs(value).format(DATETIME_INPUT_FORMAT) : null;
        case "currency":
            return parseFloat(value.replace(CURRENCY_REGEX, "")) || 0;
        case "number":
            return parseFloat(value.replace(NUMBER_REGEX, "")) || 0;
        case "boolean":
            return value === "true" || value === true ? true : false;
        case "text":
        default:
            return value.trim();
    }
};