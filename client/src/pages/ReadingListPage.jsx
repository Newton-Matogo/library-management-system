import { useState } from "react";
import { Link } from "react-router-dom";
import { useReadingList } from "../context/ReadingListContext";

function ReadingListPage() {
  const { readingList, removeBook, clearList } = useReadingList();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitBorrowingRequest = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in before submitting a borrowing request.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/borrow-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookIds: readingList.map((book) => book.id),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Failed to submit borrowing request.",
        );
      }

      setMessage("Your borrowing request was submitted successfully!");
      clearList();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>My Reading List</h1>

      {message && <p>{message}</p>}

      {readingList.length === 0 ? (
        <p>Your reading list is empty.</p>
      ) : (
        <>
          <button onClick={clearList}>Clear Reading List</button>

          <button onClick={submitBorrowingRequest} disabled={loading}>
            {loading ? "Submitting..." : "Submit Borrowing Request"}
          </button>

          <div>
            {readingList.map((book) => (
              <div key={book.id}>
                <h2>{book.title}</h2>
                <p>Author: {book.author}</p>

                <Link to={`/books/${book.id}`}>View Book</Link>

                <button onClick={() => removeBook(book.id)}>Remove</button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default ReadingListPage;
