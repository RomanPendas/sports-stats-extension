import React from "react";

const ScoreRow = ({
  awayScore,
  homeScore,
  gameStatus,
  isWin,
  isLoss,
  isTie,
  awayColor,
  homeColor,
}) => {
  return (
    <div className="scoreRow">
      {gameStatus === "post" ? (
        <>
          {/* ✅ Swapped scores for post games */}
          <span style={{ color: isWin ? "#00a900" : "red" }}>
            {isWin ? "W" : "L"}
          </span>
          <span style={{ color: `#${awayColor}` }}>{awayScore}</span>{" "}
          {/* 🏠 Home score now correct */}
          <span>vs</span>
          <span style={{ color: `#${homeColor}` }}>{homeScore}</span>{" "}
          {/* ✈️ Away score now correct */}
          <span style={{ color: isLoss ? "#00a900" : "red" }}>
            {isLoss ? "W" : "L"}
          </span>
        </>
      ) : (
        <>
          {/* ✅ Swapped scores for live games */}
          <span style={{ color: `#${awayColor}` }}>{awayScore}</span>{" "}
          {/* 🏠 Home score now correct */}
          <span>vs</span>
          <span style={{ color: `#${homeColor}` }}>{homeScore}</span>{" "}
          {/* ✈️ Away score now correct */}
        </>
      )}
    </div>
  );
};

export default ScoreRow;
