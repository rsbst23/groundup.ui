import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { editBook, fetchBooks } from "../../../store/booksSlice";

const EditBook = () => {
  const { id } = useParams(); // Get ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, loading, error } = useSelector((state) => state.books);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (books.length === 0) {
      dispatch(fetchBooks());
    }
  }, [dispatch, books.length]);

  useEffect(() => {
    const book = books.find((b) => b.id.toString() === id);
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
    }
  }, [books, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const payload = { id, title: title.trim(), author: author.trim() };
    console.log("Updating book:", payload);

    const resultAction = await dispatch(editBook(payload));

    if (editBook.fulfilled.match(resultAction)) {
      navigate("/books");
    } else {
      console.error("Update failed:", resultAction.error);
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 400,
        margin: "auto",
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h5" align="center">
        Edit Book
      </Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />

      <Button type="submit" variant="contained">
        Update Book
      </Button>
    </Box>
  );
};

export default EditBook;
