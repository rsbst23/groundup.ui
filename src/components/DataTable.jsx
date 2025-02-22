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
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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
        let newFilters;
        if (filterType === "date") {
            newFilters = {
                ...filters,
                [`MinFilters[${activeFilterColumn}]`]: null,
                [`MaxFilters[${activeFilterColumn}]`]: null,
            };
        } else {
            newFilters = {
                ...filters,
                [activeFilterColumn]: "",
            };
        }
        onFilterApply(newFilters);
        handleFilterClose();
    };

    // Determine the filter type for the active column.
    const activeColDef = columns.find((c) => c.field === activeFilterColumn);
    const activeFilterType = activeColDef?.filterType || "text";

    return (
        <Paper sx={{ p: 2 }}>
            {loading ? (
                <Typography variant="h6">Loading data...</Typography>
            ) : error ? (
                <Typography variant="h6" color="error">
                    Error: {String(error)}
                </Typography>
            ) : (
                <>
                    <TableContainer>
                        <Table>
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
                                        <strong>Actions</strong>
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {data.length > 0 ? (
                                    data.map((row) => (
                                        <TableRow key={row.id}>
                                            {columns.map((column) => (
                                                <TableCell key={column.field}>{row[column.field]}</TableCell>
                                            ))}
                                            <TableCell align="right">
                                                <IconButton component={RouterLink} to={`${row.id}/edit`} color="primary">
                                                    <EditIcon />
                                                </IconButton>
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
                                                No records found. Adjust filters and try again.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={totalRecords}
                        page={page}
                        onPageChange={onPageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={onRowsPerPageChange}
                    />

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
                                        label="Min Date"
                                        value={tempMinDate}
                                        onChange={(date) => setTempMinDate(date)}
                                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                    />
                                    <DatePicker
                                        label="Max Date"
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
                                    value={tempTextFilter}
                                    onChange={(event) => setTempTextFilter(event.target.value)}
                                />
                            )}
                            <Button onClick={applyFilter} variant="contained" color="primary">
                                Apply Filter
                            </Button>
                            <Button onClick={clearFilter} color="secondary">
                                Clear Filter
                            </Button>
                        </Paper>
                    </Popover>
                </>
            )}
        </Paper>
    );
};

export default DataTable;
