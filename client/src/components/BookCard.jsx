import { Link } from "react-router-dom";

function BookCard({ book }) {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>

      <p>
        <strong>Author:</strong> {book.author}
      </p>

      <p>
        <strong>Genre:</strong> {book.genre?.name || "Uncategorized"}
      </p>

      <p>
        <strong>ISBN:</strong> {book.isbn || "Not available"}
      </p>

      <p>
        <strong>Available copies:</strong> {book.totalCopies}
      </p>

      <Link to={`/books/${book.id}`}>View Details</Link>
    </div>
  );
}

export default BookCard;
