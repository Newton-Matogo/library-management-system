import { useEffect, useState } from "react";
import BookCard from "./BookCard";

function BookGrid({ genreId, search }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (genreId) {
          params.append("genreId", genreId);
        }

        if (search) {
          params.append("search", search);
        }

        const response = await fetch(`${API_URL}/books?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to load books. Please try again.");
        }

        const result = await response.json();

        setBooks(result.data);
      } catch (err) {
        setError(err.message);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [API_URL, genreId, search]);

  if (loading) {
    return <p>Loading books...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (books.length === 0) {
    return <p>No books found.</p>;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookGrid;
