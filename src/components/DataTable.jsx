import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useTranslation } from "react-i18next";
import { formatValue } from "../utils/valueFormatter";

const DataTable = ({
    columns,
    data = [], // Default empty array prevents errors
    loading,
    error,
    totalRecords,
    page,
    rowsPerPage,
    sortBy,
    sortDirection,
    onSort,
    onPageChange,
    onRowsPerPageChange,
    onDelete,
    // For filtering:
    filters,
    onFilterApply,
}) => {
    const { t } = useTranslation();
    // Local state for managing the filtering popover UI.
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);
    // For text filters:
    const [tempTextFilter, setTempTextFilter] = useState("");
    // For date filters (min/max):
    const [tempMinDate, setTempMinDate] = useState(null);
    const [tempMaxDate, setTempMaxDate] = useState(null);

    // When a filter icon is clicked, record which column is active and load any existing filter value.
    const handleFilterIconClick = (event, column) => {
        setActiveFilterColumn(column);
        setFilterAnchor(event.currentTarget);
        const colDef = columns.find((c) => c.field === column);
        const filterType = colDef?.filterType || "text";
        if (filterType === "date") {
            // Convert any stored string value to a Dayjs object for the DatePicker.
            setTempMinDate(filters[`MinFilters[${column}]`] ? dayjs(filters[`MinFilters[${column}]`]) : null);
            setTempMaxDate(filters[`MaxFilters[${column}]`] ? dayjs(filters[`MaxFilters[${column}]`]) : null);
        } else {
            setTempTextFilter(filters[column] || "");
        }
    };

    const handleFilterClose = () => {
        setFilterAnchor(null);
        setActiveFilterColumn(null);
        setTempTextFilter("");
        setTempMinDate(null);
        setTempMaxDate(null);
    };

    const applyFilter = () => {
        if (!activeFilterColumn) return;
        const colDef = columns.find((c) => c.field === activeFilterColumn);
        const filterType = colDef?.filterType || "text";
        let newFilters;
        if (filterType === "date") {
            newFilters = {
                ...filters,
                [`MinFilters[${activeFilterColumn}]`]: tempMinDate ? dayjs(tempMinDate).format("YYYY-MM-DD") : null,
                [`MaxFilters[${activeFilterColumn}]`]: tempMaxDate ? dayjs(tempMaxDate).format("YYYY-MM-DD") : null,
            };
        } else {
            newFilters = {
                ...filters,
                [activeFilterColumn]: tempTextFilter,
            };
        }
        onFilterApply(newFilters);
        handleFilterClose();
    };

    const clearFilter = () => {
        if (!activeFilterColumn) return;
        const colDef = columns.find((c) => c.field === activeFilterColumn);
        const filterType = colDef?.filterType || "text";
        let newFilters = { ...filters };

        if (filterType === "date") {
            newFilters[`MinFilters[${activeFilterColumn}]`] = null;
            newFilters[`MaxFilters[${activeFilterColumn}]`] = null;
        } else {
            // Use null instead of empty string to ensure it's filtered out
            newFilters[activeFilterColumn] = null;
        }

        onFilterApply(newFilters);
        handleFilterClose();
    };

    // Determine the filter type for the active column.
    const activeColDef = columns.find((c) => c.field === activeFilterColumn);
    const activeFilterType = activeColDef?.filterType || "text";

    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    // **Format cell values based on column type**
    const formatCellValue = (value, column) => {
        return formatValue(value, column.type);
    };

    return (
        <Paper sx={{ p: 2 }}>
            {loading ? (
                <Typography variant="h6">{t("loading_data")}</Typography>
            ) : error ? (
                null
            ) : (
                <>
                    {/* Scrollable table with a sticky header */}
                    <TableContainer sx={{ maxHeight: "500px" }}>
                        <Table stickyHeader>
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
                                                <IconButton size="small" onClick={(event) => handleFilterIconClick(event, column.field)}>
                                                    <FilterListIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell align="right">
                                        <strong>{t("actions")}</strong>
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {data.length > 0 ? (
                                    data.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor: (theme) => theme.palette.action.hover,
                                                },
                                            }}
                                        >
                                            {columns.map((column) => (
                                                <TableCell key={column.field}>
                                                    {/* If column is marked as editLink, render as link */}
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
                                {[10, 25, 50, 100].map((size) => (
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

                    <Popover
                        open={Boolean(filterAnchor)}
                        anchorEl={filterAnchor}
                        onClose={handleFilterClose}
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
                            {activeFilterType === "date" ? (
                                <>
                                    <DatePicker
                                        label={t("min_date")}
                                        autoFocus
                                        value={tempMinDate}
                                        onChange={(date) => setTempMinDate(date)}
                                        renderInput={(params) => (
                                            <TextField {...params} autoFocus fullWidth margin="normal" />
                                        )}
                                    />
                                    <DatePicker
                                        label={t("max_date", { column: activeFilterColumn })}
                                        value={tempMaxDate}
                                        onChange={(date) => setTempMaxDate(date)}
                                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                    />
                                </>
                            ) : (
                                <TextField
                                    label={`Filter by ${activeFilterColumn}`}
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    autoFocus
                                    value={tempTextFilter}
                                    onChange={(event) => setTempTextFilter(event.target.value)}
                                />
                            )}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                                <Button
                                    onClick={applyFilter}
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
                                    onClick={clearFilter}
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
                </>
            )}
        </Paper>
    );
};

export default DataTable;