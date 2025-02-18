import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks, removeBook } from "../../../store/booksSlice";
import { Link as RouterLink } from "react-router-dom";
import {
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Box,
    Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { usePage } from "../../../contexts/PageContext";

const BooksList = () => {
    const dispatch = useDispatch();
    const { books, loading, error } = useSelector((state) => state.books);
    const { setPageConfig } = usePage();

    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);

    useEffect(() => {
        setPageConfig({
            title: "Book List",
            breadcrumb: "Books",
            actions: (
                <Button component={RouterLink} to="application/books/add" variant="contained" color="primary">
                    Add New Book
                </Button>
            ),
        });
    }, [setPageConfig]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            dispatch(removeBook(id));
        }
    };

    return (
        <Paper sx={{ p: 2 }}>
            {loading ? (
                <Typography variant="h6">Loading books...</Typography>
            ) : error ? (
                <Typography variant="h6" color="error">
                    Error: {error}
                </Typography>
            ) : books.length === 0 ? (
                <Typography variant="h6">No books found.</Typography>
            ) : (
                <List>
                    {books.map((book) => (
                        <ListItem
                            key={book.id}
                            secondaryAction={
                                <>
                                    <IconButton component={RouterLink} to={`${book.id}/edit`} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(book.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText
                                primary={
                                    <Typography
                                        component={RouterLink}
                                        to={`${book.id}`}
                                        sx={{ textDecoration: "none", color: "inherit", "&:hover": { textDecoration: "underline" } }}
                                    >
                                        {book.title}
                                    </Typography>
                                }
                                secondary={`Author: ${book.author}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default BooksList;
