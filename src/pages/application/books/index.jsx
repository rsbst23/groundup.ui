import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks, removeBook } from "../../../store/booksSlice";
import { Link as RouterLink } from "react-router-dom";
import { Link, Button, List, ListItem, ListItemText, IconButton, Typography, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const BooksList = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      dispatch(removeBook(id));
    }
  };

  if (loading) return <Typography variant="h6">Loading books...</Typography>;
  if (error)
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );
  if (books.length === 0)
    return <Typography variant="h6">No books found.</Typography>;

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Books List
      </Typography>
      <Button
        component={RouterLink}
        to="add"
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
      >
        Add New Book
      </Button>
      <List>
        {books.map((book) => (
          <ListItem
            key={book.id}
            secondaryAction={
              <>
                <IconButton
                  component={RouterLink}
                  to={`${book.id}/edit`}
                  edge="end"
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(book.id)}
                  edge="end"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={
                <Link component={RouterLink} to={`${book.id}`}>
                    {book.title}
                </Link>
              }
              secondary={`Author: ${book.author}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BooksList;
