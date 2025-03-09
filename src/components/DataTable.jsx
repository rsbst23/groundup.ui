import React, { memo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Paper,
    TableSortLabel,
    Popover,
    TextField,
    Button,
    Box,
    Select,
    MenuItem
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useTranslation } from "react-i18next";
import { formatValue } from "../utils/valueFormatter";
import { PAGINATION, TABLE } from "../constants/pagination";

// Memoized table header component
const TableHeader = memo(({ columns, sortBy, sortDirection, onSort, onFilterClick }) => {
    return (
        <TableHead>
            <TableRow>
                {columns.map((column) => (
                    <TableCell key={column.field}>
                        <TableSortLabel
                            active={sortBy === column.field}
                            direction={sortBy === column.field ? sortDirection : "asc"}
                            onClick={() => onSort(column.field)}
                        >
                            {column.label}
                        </TableSortLabel>
                        {column.filterable && (
                            <IconButton
                                size="small"
                                onClick={(event) => onFilterClick(event, column.field, column)}
                            >
                                <FilterListIcon fontSize="small" />
                            </IconButton>
                        )}
                    </TableCell>
                ))}
                <TableCell align="right">
                    <strong>Actions</strong>
                </TableCell>
            </TableRow>
        </TableHead>
    );
});

// Memoized table row component
const TableRowItem = memo(({ row, columns, onDelete, formatCellValue }) => {
    return (
        <TableRow
            sx={{
                "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                },
            }}
        >
            {columns.map((column) => (
                <TableCell key={column.field}>
                    {column.editLink ? (
                        <RouterLink to={`${row.id}/edit`} style={{ textDecoration: "none" }}>
                            {formatCellValue(row[column.field], column)}
                        </RouterLink>
                    ) : (
                        formatCellValue(row[column.field], column)
                    )}
                </TableCell>
            ))}
            <TableCell align="right">
                <IconButton onClick={() => onDelete(row.id)} color="error">
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
});

// Memoized pagination controls component
const PaginationControls = memo(({
    page,
    rowsPerPage,
    totalRecords,
    onPageChange,
    onRowsPerPageChange
}) => {
    const { t } = useTranslation();
    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            {/* Left Side: Items Per Page */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2">{t("items_per_page")}</Typography>
                <Select
                    variant="outlined"
                    size="small"
                    value={rowsPerPage}
                    onChange={onRowsPerPageChange}
                >
                    {PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                        <MenuItem key={size} value={size}>
                            {size}
                        </MenuItem>
                    ))}
                </Select>
                <Typography variant="body2">
                    {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, totalRecords)} ${t("of")} ${totalRecords} ${t("items")}`}
                </Typography>
            </Box>

            {/* Right Side: Pagination Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                    onClick={() => onPageChange(null, 0)}
                    disabled={page === 0}
                >
                    <FirstPageIcon />
                </IconButton>

                <IconButton
                    onClick={() => onPageChange(null, page - 1)}
                    disabled={page === 0}
                >
                    <KeyboardArrowLeftIcon />
                </IconButton>

                <TextField
                    variant="outlined"
                    size="small"
                    sx={{ width: 60, textAlign: "center" }}
                    type="number"
                    inputProps={{ min: 1, max: totalPages }}
                    value={page + 1} // MUI uses zero-based index, but we display one-based
                    onChange={(event) => {
                        let newPage = parseInt(event.target.value, 10) - 1; // Convert to zero-based index
                        if (!isNaN(newPage) && newPage >= 0 && newPage < totalPages) {
                            onPageChange(null, newPage);
                        }
                    }}
                />
                <Typography variant="body2">{t("of")}&nbsp;&nbsp;{totalPages}</Typography>

                <IconButton
                    onClick={() => onPageChange(null, page + 1)}
                    disabled={page >= totalPages - 1}
                >
                    <KeyboardArrowRightIcon />
                </IconButton>

                <IconButton
                    onClick={() => onPageChange(null, totalPages - 1)}
                    disabled={page >= totalPages - 1}
                >
                    <LastPageIcon />
                </IconButton>
            </Box>
        </Box>
    );
});

// Filter popover component
const FilterPopover = memo(({
    open,
    anchorEl,
    onClose,
    activeColumn,
    activeColumnDef,
    tempTextFilter,
    tempMinDate,
    tempMaxDate,
    onTextFilterChange,
    onMinDateChange,
    onMaxDateChange,
    onApply,
    onClear
}) => {
    const { t } = useTranslation();
    const filterType = activeColumnDef?.filterType || 'text';

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Paper
                sx={{
                    p: 2,
                    minWidth: 250,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {filterType === "date" ? (
                    <>
                        <DatePicker
                            label={t("min_date")}
                            autoFocus
                            value={tempMinDate}
                            onChange={onMinDateChange}
                            renderInput={(params) => (
                                <TextField {...params} autoFocus fullWidth margin="normal" />
                            )}
                        />
                        <DatePicker
                            label={t("max_date", { column: activeColumn })}
                            value={tempMaxDate}
                            onChange={onMaxDateChange}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        />
                    </>
                ) : (
                    <TextField
                        label={`Filter by ${activeColumn}`}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        autoFocus
                        value={tempTextFilter}
                        onChange={(e) => onTextFilterChange(e.target.value)}
                    />
                )}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                    <Button
                        onClick={onApply}
                        variant="contained"
                        color="primary"
                        sx={{
                            flex: 1,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {t("apply_filter")}
                    </Button>
                    <Button
                        onClick={onClear}
                        variant="outlined"
                        sx={{
                            flex: 1,
                            whiteSpace: 'nowrap',
                            backgroundColor: 'transparent',
                            color: '#3a856a',
                            borderColor: '#3a856a',
                            '&:hover': {
                                backgroundColor: 'rgba(58, 133, 106, 0.1)',
                                borderColor: '#3a856a',
                                color: '#3a856a'
                            }
                        }}
                    >
                        {t("clear_filter")}
                    </Button>
                </Box>
            </Paper>
        </Popover>
    );
});

/**
 * Main DataTable component
 */
const DataTable = ({
    // Data and state
    columns,
    data = [],
    loading,
    error,
    totalRecords = 0,

    // Pagination
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,

    // Sorting
    sortBy = 'id',
    sortDirection = 'asc',
    onSort,

    // Actions
    onDelete,

    // Filtering
    filters = {},
    onFilterApply,
    handleFilterIconClick,
    handleFilterClose,
    applyFilter,
    clearFilter,
    filterAnchor,
    activeFilterColumn,
    tempTextFilter = '',
    tempMinDate = null,
    tempMaxDate = null,
    setTempTextFilter,
    setTempMinDate,
    setTempMaxDate,
}) => {
    const { t } = useTranslation();

    // Find the active column definition
    const activeColumnDef = activeFilterColumn ?
        columns.find(col => col.field === activeFilterColumn) : null;

    // Format cell values based on column type
    const formatCellValue = (value, column) => {
        return formatValue(value, column.type);
    };

    if (loading) {
        return <Typography variant="h6">{t("loading_data")}</Typography>;
    }

    if (error) {
        return null; // Error handling is done by ListPageLayout
    }

    return (
        <Paper sx={{ p: 2 }}>
            {/* Scrollable table with a sticky header */}
            <TableContainer sx={{ maxHeight: TABLE.MAX_HEIGHT }}>
                <Table stickyHeader>
                    <TableHeader
                        columns={columns}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onSort={onSort}
                        onFilterClick={handleFilterIconClick}
                    />

                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row) => (
                                <TableRowItem
                                    key={row.id}
                                    row={row}
                                    columns={columns}
                                    onDelete={onDelete}
                                    formatCellValue={formatCellValue}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        {t("no_records_found")}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <PaginationControls
                page={page}
                rowsPerPage={rowsPerPage}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />

            <FilterPopover
                open={Boolean(filterAnchor)}
                anchorEl={filterAnchor}
                onClose={handleFilterClose}
                activeColumn={activeFilterColumn}
                activeColumnDef={activeColumnDef}
                tempTextFilter={tempTextFilter}
                tempMinDate={tempMinDate}
                tempMaxDate={tempMaxDate}
                onTextFilterChange={setTempTextFilter}
                onMinDateChange={setTempMinDate}
                onMaxDateChange={setTempMaxDate}
                onApply={applyFilter}
                onClear={clearFilter}
            />
        </Paper>
    );
};

export default memo(DataTable);