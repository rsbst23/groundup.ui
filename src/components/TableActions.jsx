import React, { memo } from 'react';
import {
    Box,
    Button,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';

/**
 * Reusable component for table actions
 * Provides common functionality like export, reset filters, etc.
 */
const TableActions = ({
    filters = {},
    onResetFilters,
    onExport,
    additionalActions = [],
    showFilterReset = true,
    showExport = true
}) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const hasActiveFilters = Object.keys(filters).length > 0;

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleActionClick = (action) => {
        handleCloseMenu();
        if (action.onClick) {
            action.onClick();
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Reset Filters Button */}
            {showFilterReset && (
                <Tooltip title={t('reset_filters')}>
                    <IconButton
                        onClick={onResetFilters}
                        disabled={!hasActiveFilters}
                        color={hasActiveFilters ? 'primary' : 'default'}
                    >
                        {hasActiveFilters ? <FilterListOffIcon /> : <FilterListIcon />}
                    </IconButton>
                </Tooltip>
            )}

            {/* Export Button */}
            {showExport && (
                <Tooltip title={t('export')}>
                    <IconButton onClick={onExport} color="primary">
                        <DownloadIcon />
                    </IconButton>
                </Tooltip>
            )}

            {/* Additional Actions Menu */}
            {additionalActions.length > 0 && (
                <>
                    <Tooltip title={t('more_actions')}>
                        <IconButton onClick={handleOpenMenu}>
                            <MoreVertIcon />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                    >
                        {additionalActions.map((action, index) => (
                            <React.Fragment key={action.id || index}>
                                {action.divider && <Divider />}
                                <MenuItem
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
                            </React.Fragment>
                        ))}
                    </Menu>
                </>
            )}
        </Box>
    );
};

export default memo(TableActions);