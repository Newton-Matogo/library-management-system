import { Link } from "react-router-dom";
import { useReadingList } from "../context/ReadingListContext";

function BookCard({ book }) {
  const { readingList, addBook, removeBook } = useReadingList();

  const isAdded = readingList.some((item) => item.id === book.id);

  const handleReadingList = () => {
    if (isAdded) {
      removeBook(book.id);
    } else {
      addBook(book);
    }
  };

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

      <button onClick={handleReadingList}>
        {isAdded ? "Remove from Reading List" : "Add to Reading List"}
      </button>
    </div>
  );
}

export default BookCard;
