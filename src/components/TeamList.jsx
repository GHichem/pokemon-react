import React from "react";
import Team from "./Team";
import { MdDeleteForever } from "react-icons/md";

const TeamList = ({ tables, handleDeleteTable, handleSelectTeam, toRoman }) => {
  return (
    <div className="pokemon-cards-container">
      {tables.map((table, index) => {
        const team = table[0] || [];
        const teamNumber = index + 1;
        const generation = table[1];

        return (
          <div key={index} className="team-wrapper">
            <div className="team-header">
              <button onClick={() => handleDeleteTable(teamNumber)} className="delete-button">
                <MdDeleteForever />
              </button>
              <span className="team-gen gen-span">Gen {toRoman(generation)}</span>
            </div>
            <div onClick={() => handleSelectTeam(index)} className="team-pokemon-container">
              <Team
                id={index}
                image1={team[0]?.shiny ? team[0].shiny_img : team[0]?.img}
                image2={team[1]?.shiny ? team[1].shiny_img : team[1]?.img}
                image3={team[2]?.shiny ? team[2].shiny_img : team[2]?.img}
                image4={team[3]?.shiny ? team[3].shiny_img : team[3]?.img}
                image5={team[4]?.shiny ? team[4].shiny_img : team[4]?.img}
                image6={team[5]?.shiny ? team[5].shiny_img : team[5]?.img}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamList;
