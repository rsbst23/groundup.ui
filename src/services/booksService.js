import apiService from "./apiService";

const RESOURCE = "Books";

export const getBooks = () => apiService.getAll(RESOURCE);
export const getBookById = (id) => apiService.getById(RESOURCE, id);
export const createBook = (bookData) => apiService.create(RESOURCE, bookData);
export const updateBook = (id, bookData) => apiService.update(RESOURCE, id, bookData);
export const deleteBook = (id) => apiService.delete(RESOURCE, id);
