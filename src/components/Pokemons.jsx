import React from "react";

function Pokemons(props) {
  const handleRemovePokemon = (e) => {
    e.stopPropagation(); // Prevent triggering the onClick of the parent div
    props.onClick();
  };

  const handleToggleShiny = async () => {
    const newShinyStatus = !props.isShiny;
    await props.onToggleShiny(props.name, newShinyStatus);
  };

  return (
    <div className="pokemon-card">
      <h1>{props.name}</h1>
      <img
        src={props.isShiny ? props.shiny_img : props.image1 || "/unknown/unknown.png"}
        alt={props.name || "Unknown Pokémon"}
        onClick={handleRemovePokemon}
      />
      <div className="types">
        {props.type1 && <img src={`/type/${props.type1}.png`} alt={props.type1} className="type-image" />}
        {props.type2 && <img src={`/type/${props.type2}.png`} alt={props.type2} className="type-image" />}
      </div>
      {props.name !== "Unknown" && (
        <button type="button" onClick={handleToggleShiny}>
          <img src={props.isShiny ? '/shiny/ShinyHOMEStar.png' : '/shiny/ShinySVStar.png'} alt="Shiny Toggle" className="shiny-toggle-image" />
        </button>
      )}
    </div>
  );
}

export default Pokemons;
