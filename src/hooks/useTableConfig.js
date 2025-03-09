import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useDataTable from './useDataTable';

/**
 * Hook for creating table configurations with localized column headers and common settings
 * 
 * @param {Object} options Configuration options
 * @param {Object} options.tableOptions Options to pass to useDataTable
 * @param {Array<Object>} options.columnDefs Column definitions with optional translation keys
 * @param {Object} options.translationPrefix Prefix for translation keys (defaults to empty string)
 * @returns {Object} Configured table props including translated columns
 */
const useTableConfig = ({
    tableOptions,
    columnDefs,
    translationPrefix = ''
}) => {
    const { t } = useTranslation();

    // Get table props from the Redux table hook
    const tableProps = useDataTable(tableOptions);

    // Create translated column configurations
    const columns = useMemo(() => {
        return columnDefs.map(col => ({
            ...col,
            // If label is a translation key, translate it, otherwise use as-is
            label: col.translationKey ? t(translationPrefix + col.translationKey) : col.label
        }));
    }, [columnDefs, t, translationPrefix]);

    return {
        ...tableProps,
        columns
    };
};

export default useTableConfig;