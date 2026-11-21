import { useEffect, useState } from "react";

function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(input);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [input, onSearch]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search books by title or author..."
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
    </div>
  );
}

export default SearchBar;
