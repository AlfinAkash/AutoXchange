import React, { useState } from "react";

const SearchBar = ({ onSearchResults }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`https://onrender.com/api/v1/filters/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      onSearchResults(data);
    } catch (err) {
      console.error("Search Error:", err);
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="input-group w-100 w-md-50 mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search by RC No, Vehicle No, Model, etc..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="btn btn-outline-primary"
        type="button"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-search"></i>}
      </button>
    </div>
  );
};

export default SearchBar;
