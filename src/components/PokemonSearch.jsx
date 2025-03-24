import React from "react";

const PokemonSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <input
      type="text"
      placeholder="Search Pokémon"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="search-input"
    />
  );
};

export default PokemonSearch;
