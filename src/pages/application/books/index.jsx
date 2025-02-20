import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks, removeBook } from "../../../store/booksSlice";
import { Link as RouterLink } from "react-router-dom";
import {
    Button,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { usePage } from "../../../contexts/PageContext";
import ListPageLayout from "../../../components/layouts/ListPageLayout";

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
                <Button component={RouterLink} to="add" variant="contained" color="primary">
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
        <ListPageLayout
            title="Books"
            actions={<Button component={RouterLink} to="add" variant="contained">Add New Book</Button>}
            loading={loading}
            error={error}
        >
            {/* Table View */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>Author</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book.id}>
                                <TableCell>
                                    <Typography
                                        component={RouterLink}
                                        to={`${book.id}`}
                                        sx={{ textDecoration: "none", color: "inherit", "&:hover": { textDecoration: "underline" } }}
                                    >
                                        {book.title}
                                    </Typography>
                                </TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell align="right">
                                    <IconButton component={RouterLink} to={`${book.id}/edit`} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(book.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ListPageLayout>
    );
};

export default BooksList;
