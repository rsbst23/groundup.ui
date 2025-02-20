import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventoryCategories, removeInventoryCategory } from "../../../store/inventoryCategoriesSlice";
import { Link as RouterLink } from "react-router-dom";
import {
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { usePage } from "../../../contexts/PageContext";

const InventoryCategoriesList = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.inventoryCategories);
    const { setPageConfig } = usePage();

    useEffect(() => {
        dispatch(fetchInventoryCategories());
    }, [dispatch]);

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

    return (
        <Paper sx={{ p: 2 }}>
            {loading ? (
                <Typography variant="h6">Loading categories...</Typography>
            ) : error ? (
                <Typography variant="h6" color="error">
                    Error: {error}
                </Typography>
            ) : categories.length === 0 ? (
                <Typography variant="h6">No categories found.</Typography>
            ) : (
                <List>
                    {(Array.isArray(categories) ? categories : []).map((category) => (
                        <ListItem
                            key={category.id}
                            secondaryAction={
                                <>
                                    <IconButton component={RouterLink} to={`${category.id}/edit`} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(category.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText
                                primary={
                                    <Typography
                                        component={RouterLink}
                                        to={`${category.id}`}
                                        sx={{ textDecoration: "none", color: "inherit", "&:hover": { textDecoration: "underline" } }}
                                    >
                                        {category.name}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default InventoryCategoriesList;
