const API_URL = "https://localhost:5001/api/Books"; // Replace with your actual API URL

export const getBooks = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch books");
  return await response.json();
};

export const createBook = async (bookData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(bookData),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to create book");
  return await response.json();
};

export const updateBook = async (id, bookData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...bookData }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update book: ${response.statusText}`);
  }

  return await response.json();
};

export const deleteBook = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete book");
};
