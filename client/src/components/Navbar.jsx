import { Link } from "react-router-dom";
import { useReadingList } from "../context/ReadingListContext";

function Navbar() {
  const { readingList } = useReadingList();

  return (
    <nav>
      <Link to="/">Home</Link>

      <Link to="/spaces/book">Book a Space</Link>

      <Link to="/login">Login</Link>

      <Link to="/register">Register</Link>

      <Link to="/reading-list">Reading List ({readingList.length})</Link>
    </nav>
  );
}

export default Navbar;
