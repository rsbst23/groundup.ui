import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/booksService";

// Async Thunks with Error Handling
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      return await getBooks();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBook = createAsyncThunk(
  "books/addBook",
  async (book, { rejectWithValue }) => {
    try {
      return await createBook(book);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editBook = createAsyncThunk(
  "books/editBook",
  async ({ id, title, author }, { rejectWithValue }) => {
    try {
      const response = await updateBook(id, { id, title, author });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeBook = createAsyncThunk(
  "books/removeBook",
  async (id, { rejectWithValue }) => {
    try {
      await deleteBook(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    loading: false,
    deletingId: null, // Track which book is being deleted
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Book
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Book
      .addCase(editBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.books[index] = action.payload;
      })
      .addCase(editBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Book
      .addCase(removeBook.pending, (state, action) => {
        state.deletingId = action.meta.arg; // Store ID of book being deleted
      })
      .addCase(removeBook.fulfilled, (state, action) => {
        state.deletingId = null;
        state.books = state.books.filter((b) => b.id !== action.payload);
      })
      .addCase(removeBook.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload;
      });
  },
});

export default booksSlice.reducer;
