import React from "react";

const PokemonGrid = ({ filteredPokemonList, handleAddPokemonToTeam }) => {
  return (
    <div className="pokemon-grid">
      {filteredPokemonList.map((pokemon, index) => (
        <div key={index} className="pokemon-card-list" onClick={() => handleAddPokemonToTeam(pokemon)}>
          <p className="pokemon-name">{pokemon.name}</p>
          <img src={pokemon.img} alt={pokemon.name} />
        </div>
      ))}
    </div>
  );
};

export default PokemonGrid;
