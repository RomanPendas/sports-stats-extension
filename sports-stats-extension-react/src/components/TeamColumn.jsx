import React from "react";

const TeamColumn = ({ team, logo, record, color, align }) => (
  <div className="teamColumn" style={{ textAlign: align }}>
    <div className="teamLogo">
      <img
        src={logo}
        alt={`${team} Logo`}
        style={{ width: "50px", height: "auto" }}
      />
    </div>
    <div className="teamName" style={{ color: `#${color}` }}>
      {team}
      <div className="teamRecord">{record}</div>
    </div>
  </div>
);

export default TeamColumn;
