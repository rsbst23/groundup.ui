import React from "react";
import { Box, Paper, Typography, Divider, IconButton, Tooltip, Menu, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import ErrorDisplay from "../common/ErrorDisplay";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

/**
 * An enhanced reusable layout for list pages with table actions support.
 * @param {Object} props
 * @param {ReactNode} props.title - The title of the list page.
 * @param {ReactNode} props.actions - Primary action buttons (e.g., "Add New Book").
 * @param {boolean} props.loading - Whether data is still loading.
 * @param {Error|Object|string} props.error - An error (if any).
 * @param {boolean} props.showDetailedErrors - Whether to show detailed error information.
 * @param {string} props.contextName - Context name for error tracking.
 * @param {ReactNode} props.children - The list content.
 * @param {Object} props.tableState - Table state for filter management
 * @param {Function} props.onResetFilters - Handler for resetting filters
 * @param {Function} props.onExport - Handler for exporting data
 * @param {Array} props.additionalActions - Additional actions for the menu
 * @param {boolean} props.showTableActions - Whether to show table actions (default: true)
 */
const ListPageLayout = ({
    title,
    actions,
    loading,
    error,
    showDetailedErrors = false,
    contextName = "ListPage",
    children,
    tableState,
    onResetFilters,
    onExport,
    additionalActions = [],
    showTableActions = true
}) => {
    const { t } = useTranslation();
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    // Check if we have active filters
    const hasActiveFilters = tableState?.filters && Object.keys(tableState.filters).length > 0;

    // Menu handlers
    const handleOpenMenu = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
    };

    const handleActionClick = (action) => {
        if (action.onClick) {
            action.onClick();
        }
        handleCloseMenu();
    };

    return (
        <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2
            }}>
                {/* Left side: Title */}
                <Typography variant="h5" component="h1">{title}</Typography>

                {/* Right side: Actions */}
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap"
                }}>
                    {/* Table actions */}
                    {showTableActions && tableState && (
                        <>
                            {/* Reset filters */}
                            {onResetFilters && (
                                <Tooltip title={t("reset_filters")}>
                                    <span> {/* Wrapper needed for disabled tooltip */}
                                        <IconButton
                                            onClick={onResetFilters}
                                            disabled={!hasActiveFilters}
                                            color={hasActiveFilters ? "primary" : "default"}
                                        >
                                            {hasActiveFilters ? <FilterListOffIcon /> : <FilterListIcon />}
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            )}

                           

                            {/* Additional actions menu */}
                            {additionalActions && additionalActions.length > 0 && (
                                <>
                                    <Tooltip title={t("more_actions")}>
                                        <IconButton onClick={handleOpenMenu}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Menu
                                        anchorEl={menuAnchorEl}
                                        open={Boolean(menuAnchorEl)}
                                        onClose={handleCloseMenu}
                                    >
                                        {additionalActions.map((action, index) => (
                                            action.divider ? (
                                                <Divider key={`divider-${index}`} />
                                            ) : (
                                                <MenuItem
                                                    key={action.id || `action-${index}`}
                                                    onClick={() => handleActionClick(action)}
                                                    disabled={action.disabled}
                                                >
                                                    {action.icon && (
                                                        <Box component="span" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                                            {action.icon}
                                                        </Box>
                                                    )}
                                                    {action.label}
                                                </MenuItem>
                                            )
                                        ))}
                                    </Menu>
                                </>
                            )}
                        </>
                    )}

                    {/* Primary actions (Add button, etc.) */}
                    {actions}
                </Box>
            </Box>

            {/* Divider between header and content */}
            <Divider />

            {/* Content area */}
            {loading ? (
                <Typography variant="h6">{t("loading")}</Typography>
            ) : error ? (
                <ErrorDisplay
                    error={error}
                    showDetails={showDetailedErrors}
                    context={contextName}
                />
            ) : (
                children
            )}
        </Paper>
    );
};

export default ListPageLayout;