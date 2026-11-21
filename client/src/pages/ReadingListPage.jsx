import { Link } from "react-router-dom";
import { useReadingList } from "../context/ReadingListContext";

function ReadingListPage() {
  const { readingList, removeBook, clearList } = useReadingList();

  return (
    <main>
      <h1>My Reading List</h1>

      {readingList.length === 0 ? (
        <p>Your reading list is empty.</p>
      ) : (
        <>
          <button onClick={clearList}>Clear Reading List</button>

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
