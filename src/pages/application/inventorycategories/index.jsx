import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventoryCategories, removeInventoryCategory } from "../../../store/inventoryCategoriesSlice";
import { Link as RouterLink } from "react-router-dom";
import {
    Button,
    Box,
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
    TextField,
    Popover,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { usePage } from "../../../contexts/PageContext";
import dayjs from "dayjs";

const InventoryCategoriesList = () => {
    const dispatch = useDispatch();
    const { categories, loading, error, totalRecords } = useSelector((state) => state.inventoryCategories);
    const { setPageConfig } = usePage();

    const firstFetchComplete = useRef(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState("Name");
    const [searchInput, setSearchInput] = useState("");

    const [filterAnchor, setFilterAnchor] = useState(null);
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    const [tempMinDate, setTempMinDate] = useState(null);
    const [tempMaxDate, setTempMaxDate] = useState(null);

    const [filters, setFilters] = useState({}); // Holds all applied filters
    const [tempFilters, setTempFilters] = useState({}); // Temporary filters before applying


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setFilters((prev) => ({ ...prev, name: searchInput }));
            setHasUserInteracted(true);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchInput]);

    useEffect(() => {
        if (!firstFetchComplete.current) {
            firstFetchComplete.current = true;
            console.log("Initial API call triggered");
            dispatch(fetchInventoryCategories({ pageNumber: 1, pageSize: rowsPerPage, sortBy, filters }))
                .then(() => {
                    setInitialLoading(false);
                });
        }
    }, [dispatch]);

    useEffect(() => {
        if (firstFetchComplete.current && hasUserInteracted) {
            console.log("Fetching due to user interaction:", { page, rowsPerPage, sortBy, filters });
            dispatch(fetchInventoryCategories({ pageNumber: page + 1, pageSize: rowsPerPage, sortBy, filters }));
        }
    }, [dispatch, page, rowsPerPage, sortBy, filters, hasUserInteracted]);

    useEffect(() => {
        console.log("Current Categories State:", categories);
        console.log("Current Filters State:", filters);
    }, [categories, filters]);

    useEffect(() => {
        setPageConfig({
            title: "Inventory Categories",
            breadcrumb: "Inventory Categories",
            actions: (
                <Button component={RouterLink} to="application/inventory-categories/add" variant="contained" color="primary">
                    Add New Category
                </Button>
            ),
        });
    }, [setPageConfig]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            dispatch(removeInventoryCategory(id));
        }
    };

    const handlePageChange = (_, newPage) => {
        setPage(newPage);
        setHasUserInteracted(true);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setHasUserInteracted(true);
    };

    const handleSort = (column) => {
        setSortBy((prevSortBy) => (prevSortBy === column ? `-${column}` : column));
        setHasUserInteracted(true);
    };

    const handleFilterOpen = (event, column) => {
        setActiveFilterColumn(column);
        setFilterAnchor(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchor(null);
        setActiveFilterColumn(null);
    };

    const handleDateChange = (key, date) => {
        setTempFilters((prev) => ({
            ...prev,
            [key]: date ? dayjs(date).format("YYYY-MM-DD") : null, // Ensure proper format
        }));
    };

    const applyDateFilter = () => {
        setFilters((prev) => ({
            ...prev,
            minDate: tempMinDate ? dayjs(tempMinDate).format("YYYY-MM-DD") : null,
            maxDate: tempMaxDate ? dayjs(tempMaxDate).format("YYYY-MM-DD") : null,
        }));

        setHasUserInteracted(true);
        handleFilterClose();
    };

    const applyFilters = () => {
        setFilters((prev) => ({ ...prev, ...tempFilters }));
        setHasUserInteracted(true);
        handleFilterClose();
    };

    const handleClearDateFilter = () => {
        setTempMinDate(null);
        setTempMaxDate(null);
    };

    return (
        <Paper sx={{ p: 2 }}>
            {initialLoading ? (
                <Typography variant="h6">Loading categories...</Typography>
            ) : error ? (
                <Typography variant="h6" color="error">
                    Error: {error}
                </Typography>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            {/* Table Header - Always Visible */}
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortBy === "Name" || sortBy === "-Name"}
                                            direction={sortBy === "Name" ? "asc" : "desc"}
                                            onClick={() => handleSort("Name")}
                                        >
                                            Category Name
                                        </TableSortLabel>
                                        <IconButton size="small" onClick={(event) => handleFilterOpen(event, "name")}>
                                            <FilterListIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>

                                    <TableCell>
                                        <TableSortLabel
                                            active={sortBy === "CreatedDate" || sortBy === "-CreatedDate"}
                                            direction={sortBy === "CreatedDate" ? "asc" : "desc"}
                                            onClick={() => handleSort("CreatedDate")}
                                        >
                                            Created Date
                                        </TableSortLabel>                                        
                                        <IconButton size="small" onClick={(event) => handleFilterOpen(event, "createdDate")}>
                                            <FilterListIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>

                                    <TableCell align="right">
                                        <strong>Actions</strong>
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            {/* Table Body - Always Renders */}
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            <Typography variant="body1">Loading categories...</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : categories.length > 0 ? (
                                    categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>{category.name}</TableCell>
                                            <TableCell>{category.createdDate}</TableCell>
                                            <TableCell align="right">
                                                <IconButton component={RouterLink} to={`${category.id}/edit`} color="primary">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(category.id)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            <Typography variant="body1" color="textSecondary">
                                                No records found. Adjust your filters and try again.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>




                                {/* Filter Popover with "Apply Filter" for Name & Date */}
                                
                                    <Popover
    open={Boolean(filterAnchor)}
    anchorEl={filterAnchor}
    onClose={handleFilterClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    transformOrigin={{ vertical: "top", horizontal: "center" }}
>
    <Paper sx={{ p: 2, minWidth: 250, display: "flex", flexDirection: "column", gap: 2 }}>
                                    {activeFilterColumn && (
                                        <>
                                            {/* Render Text Input for String Filters */}
                                            {activeFilterColumn === "name" && (
                                                <TextField
                                                    label={`Filter by ${activeFilterColumn}`}
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    value={tempFilters[activeFilterColumn] || ""}
                                                    onChange={(event) =>
                                                        setTempFilters({ ...tempFilters, [activeFilterColumn]: event.target.value })
                                                    }
                                                />
                                            )}

                                            {/* Render Date Pickers for Date Fields */}
                                            {activeFilterColumn === "createdDate" && (
                                                <>
                                                    <DatePicker
                                                        label="Min Date"
                                                        value={tempFilters[`MinFilters[${activeFilterColumn}]`] ? dayjs(tempFilters[`MinFilters[${activeFilterColumn}]`]) : null}
                                                        onChange={(date) => handleDateChange(`MinFilters[${activeFilterColumn}]`, date)}
                                                    />
                                                    <DatePicker
                                                        label="Max Date"
                                                        value={tempFilters[`MaxFilters[${activeFilterColumn}]`] ? dayjs(tempFilters[`MaxFilters[${activeFilterColumn}]`]) : null}
                                                        onChange={(date) => handleDateChange(`MaxFilters[${activeFilterColumn}]`, date)}
                                                    />
                                                </>
                                            )}

                                            {/* Apply & Clear Filter Buttons */}
                                            <Button
                                                onClick={() => {
                                                    setFilters((prev) => ({ ...prev, ...tempFilters }));
                                                    setHasUserInteracted(true);
                                                    handleFilterClose();
                                                }}
                                                variant="contained"
                                                color="primary"
                                            >
                                                Apply Filter
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setTempFilters((prev) => ({
                                                        ...prev,
                                                        [activeFilterColumn]: "", // Clear only the active filter
                                                        [`MinFilters[${activeFilterColumn}]`]: null,
                                                        [`MaxFilters[${activeFilterColumn}]`]: null,
                                                    }));
                                                }}
                                                color="secondary"
                                            >
                                                Clear Filter
                                            </Button>
                                        </>
                                    )}
    </Paper>
</Popover>

                </>
            )}
        </Paper>
    );
};

export default InventoryCategoriesList;
