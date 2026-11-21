import { useEffect, useState } from "react";
import BookGrid from "../components/BookGrid";
import SearchBar from "../components/SearchBar";

function HomePage() {
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState("");
  const [genres, setGenres] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${API_URL}/genres`);

        if (!response.ok) {
          throw new Error("Failed to fetch genres");
        }

        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, [API_URL]);

  return (
    <main>
      <h1>Library Book Catalogue</h1>

      <SearchBar onSearch={setSearch} />

      <div>
        <label htmlFor="genre-filter">Filter by genre: </label>

        <select
          id="genre-filter"
          value={genreId}
          onChange={(event) => setGenreId(event.target.value)}
        >
          <option value="">All Genres</option>

          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <BookGrid genreId={genreId} search={search} />
    </main>
  );
}

export default HomePage;
