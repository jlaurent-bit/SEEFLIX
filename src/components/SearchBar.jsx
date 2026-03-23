import { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for movies or TV shows..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
}