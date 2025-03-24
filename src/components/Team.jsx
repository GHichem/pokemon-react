import React from "react";

function Team(props) {
  return (
    <div id={props.id} className="team-container">
      <img src={props.image1 || "/unknown/unknown.png"} alt="{props.name1}" />
      <img src={props.image2 || "/unknown/unknown.png"} alt="{props.name2}" />
      <img src={props.image3 || "/unknown/unknown.png"} alt="{props.name3}" />
      <img src={props.image4 || "/unknown/unknown.png"} alt="{props.name4}" />
      <img src={props.image5 || "/unknown/unknown.png"} alt="{props.name5}" />
      <img src={props.image6 || "/unknown/unknown.png"} alt="{props.name6}" />
    </div>
  );
}

export default Team;
