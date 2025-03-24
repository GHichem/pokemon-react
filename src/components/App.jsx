import React, { useState, useEffect } from "react";
import TeamList from "./TeamList";
import PokemonSearch from "./PokemonSearch";
import PokemonGrid from "./PokemonGrid";
import Pokemons from "./Pokemons";
import gen from "../gen";
import axios from "axios";
import { FaPlusCircle } from "react-icons/fa";
import { IoPlaySkipBackCircle } from "react-icons/io5";

function App() {
  const [tables, setTables] = useState([]);
  const [showGenerations, setShowGenerations] = useState(false);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get("http://localhost:3001/existing-tables");
        const existingTables = response.data;
        setTables(existingTables);
        if (existingTables.length === 0) {
          setShowGenerations(true);
        }
      } catch (error) {
        console.error("Error fetching existing tables:", error);
      }
    };

    fetchTables();
  }, []);

  useEffect(() => {
    console.log("Updated tables:", tables);
  }, [tables]);

  useEffect(() => {
    console.log("Updated selected team index:", selectedTeamIndex);
    if (selectedTeamIndex !== null) {
      const fetchPokemonList = async () => {
        try {
          const genNumber = tables[selectedTeamIndex][1]; // Get the generation number
          const response = await axios.get("http://localhost:3001/generation/" + genNumber );
          setPokemonList(response.data);
        } catch (error) {
          console.error("Error fetching Pokémon list:", error);
        }
      };

      fetchPokemonList();
    }
  }, [selectedTeamIndex]);

  const handleCreateTable = async (gen) => {
    // Trigger the backend API to create a table
    try {
      await axios.get(`http://localhost:3001/create-table?gen=${gen}`);  // Pass the generation as a query parameter
      console.log("Table created successfully!");
      let nextTeamNumber = tables.length + 1;
      console.log(nextTeamNumber);
      let team = await axios.get("http://localhost:3001/team/" + nextTeamNumber);

      setTables((prevTables) => [...prevTables, [team.data, gen]]);
      setShowGenerations(false); // Hide generations after selecting one
      setSelectedTeamIndex(tables.length); // Set the selected team index to the newly created team
    } catch (error) {
      console.error("Error creating table:", error);
      alert("Failed to create table!");
    }
  };

  const handleDeleteTable = async (teamNumber) => {
    try {
      await axios.delete(`http://localhost:3001/delete-table/${teamNumber}`);
      console.log(`Table team${teamNumber} deleted successfully!`);
      setTables(tables.filter((_, index) => index + 1 !== teamNumber));
      setSelectedTeamIndex(null); // Reset selected team if it was deleted
    } catch (error) {
      console.error("Error deleting table:", error);
      alert("Failed to delete table!");
    }
  };

  const handleSelectTeam = (index) => {
    setSelectedTeamIndex(index);
  };

  const handleDeselectTeam = () => {
    setSelectedTeamIndex(null);
    setPokemonList([]);
    setSearchQuery(""); // Reset the search query
  };

  const handleAddPokemonToTeam = async (pokemon) => {
    if (selectedTeamIndex === null) return;

    const teamNumber = selectedTeamIndex + 1; // Assuming teamNumber is 1-based index
    try {
      await axios.post(`http://localhost:3001/add-pokemon/${teamNumber}`, pokemon);
      console.log(`Pokémon ${pokemon.name} added to team ${teamNumber} successfully!`);

      // Update the team in the state
      const updatedTables = [...tables];
      updatedTables[selectedTeamIndex][0].push(pokemon);
      setTables(updatedTables);
    } catch (error) {
      console.error("Error adding Pokémon to team:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to add Pokémon to team!");
      }
    }
  };

  const handleRemovePokemonFromTeam = async (pokemonName) => {
    if (selectedTeamIndex === null) return;

    const teamNumber = selectedTeamIndex + 1; // Assuming teamNumber is 1-based index
    try {
      await axios.delete(`http://localhost:3001/remove-pokemon/${teamNumber}/${pokemonName}`);
      console.log(`Pokémon ${pokemonName} removed from team ${teamNumber} successfully!`);

      // Update the team in the state
      const updatedTables = [...tables];
      updatedTables[selectedTeamIndex][0] = updatedTables[selectedTeamIndex][0].filter(pokemon => pokemon.name !== pokemonName);
      setTables(updatedTables);
    } catch (error) {
      console.error("Error removing Pokémon from team:", error);
      alert("Failed to remove Pokémon from team!");
    }
  };

  const handleToggleShiny = async (pokemonName, isShiny) => {
    if (selectedTeamIndex === null) return;

    const teamNumber = selectedTeamIndex + 1; // Assuming teamNumber is 1-based index
    try {
      await axios.put(`http://localhost:3001/update-shiny/${teamNumber}/${pokemonName}`, { isShiny });
      console.log(`Pokémon ${pokemonName} shiny status updated to ${isShiny} successfully!`);

      // Update the team in the state
      const updatedTables = [...tables];
      const team = updatedTables[selectedTeamIndex][0];
      const pokemon = team.find(pokemon => pokemon.name === pokemonName);
      if (pokemon) {
        pokemon.shiny = isShiny; // Update the shiny status
        setTables(updatedTables);
      }
    } catch (error) {
      console.error("Error updating shiny status:", error);
      alert("Failed to update shiny status!");
    }
  };

  const filteredPokemonList = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );
  const toRoman = (num) => {
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return roman[num - 1] || num;
  };

  return (
    <div>
      {showGenerations ? (
        <div className="gen-container">
          <button
            onClick={() => setShowGenerations(false)}
            className="icon-button"
          >
            <IoPlaySkipBackCircle />
          </button>
          <div className="gen-cards">
            {gen.map((gen) => (
              <div
                key={gen.id}
                className="gen-card"
                onClick={() => handleCreateTable(gen.id)}
              >
                <img src={gen.image} alt={gen.name} />
                <h2>{gen.name}</h2>
              </div>
            ))}
          </div>
        </div>
      ) : selectedTeamIndex !== null ? (
        <div>
          <button
            onClick={handleDeselectTeam}
            className="icon-button"
          >
            <IoPlaySkipBackCircle />
          </button>
          <div className="pokemon-container">
            {tables[selectedTeamIndex][0].map((pokemon, index) => (
              <Pokemons
                key={index}
                name={pokemon.name}
                image1={pokemon.img}
                shiny_img={pokemon.shiny_img}
                type1={pokemon.type1}
                type2={pokemon.type2}
                isShiny={pokemon.shiny}
                onClick={() => handleRemovePokemonFromTeam(pokemon.name)}
                onToggleShiny={handleToggleShiny}
              />
            ))}
            {Array.from({ length: 6 - tables[selectedTeamIndex][0].length }).map((_, index) => (
              <Pokemons
                key={`default-${index}`}
                name="Unknown"
                image1="/unknown/unknown.png"
                shiny_img="/unknown/unknown.png"
                type1=""
                type2=""
                isShiny={false}
                onClick={() => {}}
                onToggleShiny={() => {}}
              />
            ))}
          </div>
          <div>
            <PokemonSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <h1>Pokémon</h1>
            <PokemonGrid filteredPokemonList={filteredPokemonList} handleAddPokemonToTeam={handleAddPokemonToTeam} />
          </div>
        </div>
      ) : (
        <div>
          <TeamList
            tables={tables}
            handleDeleteTable={handleDeleteTable}
            handleSelectTeam={handleSelectTeam}
            toRoman={toRoman}
          />
          <div className="all-pokemon-list">
            {filteredPokemonList.map((pokemon, index) => (
              <div key={index} className="pokemon-list-card">
                <img src={pokemon.img} alt={pokemon.name} />
                <p>{pokemon.name}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setShowGenerations(true)} className="icon-button">
            <FaPlusCircle />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;