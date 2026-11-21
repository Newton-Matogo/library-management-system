import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function BookDetail() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/books/${id}`);

        if (!response.ok) {
          throw new Error("Book not found or could not be loaded.");
        }

        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [API_URL, id]);

  if (loading) {
    return <p>Loading book details...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!book) {
    return <p>Book not found.</p>;
  }

  return (
    <main>
      <h1>{book.title}</h1>

      <p>
        <strong>Author:</strong> {book.author}
      </p>
      <p>
        <strong>ISBN:</strong> {book.isbn || "Not available"}
      </p>
      <p>
        <strong>Genre:</strong> {book.genre?.name || "Uncategorized"}
      </p>
      <p>
        <strong>Total Copies:</strong> {book.totalCopies}
      </p>
      <p>
        <strong>Published Year:</strong> {book.publishedYear || "Not available"}
      </p>

      <Link to="/">Back to Catalogue</Link>
    </main>
  );
}

export default BookDetail;
