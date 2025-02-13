import React from "react";
import TeamColumn from "./TeamColumn";
import ScoreRow from "./ScoreRow";

const GameCard = ({ game }) => {
  const isWin = parseInt(game.homeTeamScore) > parseInt(game.awayTeamScore);
  const isLoss = parseInt(game.awayTeamScore) > parseInt(game.homeTeamScore);
  const isTie = parseInt(game.awayTeamScore) === parseInt(game.homeTeamScore);

  return (
    <div className="gameCard">
      {/* Game Header */}
      <div
        className="gameHeader"
        style={{
          color: game.gameStatus === "in" ? "red" : "dimgrey",
          fontWeight: "bold",
        }}
      >
        {game.gameStatus === "in"
          ? "LIVE"
          : game.gameStatus === "post"
          ? "FINAL"
          : new Date(game.date).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}

        {/* 🏟️ Venue Name + City & State */}
        <div className="venue">
          {game.venueData.fullName}
          {game.venueData.address &&
            game.venueData.address.city &&
            game.venueData.address.state && (
              <>
                {" "}
                - {game.venueData.address.city}, {game.venueData.address.state}
              </>
            )}
        </div>
      </div>

      {/* Game Clock & Period for Live Games */}
      {game.gameStatus === "in" && (
        <div className="gameClock">
          Q{game.gamePeriod} - {game.gameClock}
        </div>
      )}

      {/* 🔄 Teams Row - Home team now on the left, Away team on the right */}
      <div className="teamsRow">
        <TeamColumn
          team={game.homeTeamName} // 🏠 Home team moved to the left
          logo={game.homeTeamLogo}
          record={game.homeTeamRecord}
          color={game.homeTeamColor}
        />
        <TeamColumn
          team={game.awayTeamName} // ✈️ Away team moved to the right
          logo={game.awayTeamLogo}
          record={game.awayTeamRecord}
          color={game.awayTeamColor}
          align="right"
        />
      </div>

      {/* 🔄 Score Row - Swapped Home & Away */}
      {(game.gameStatus === "in" || game.gameStatus === "post") && (
        <ScoreRow
          awayScore={game.homeTeamScore} // 🏠 Home score first
          homeScore={game.awayTeamScore} // ✈️ Away score second
          gameStatus={game.gameStatus}
          isWin={isWin}
          isLoss={isLoss}
          isTie={isTie}
          awayColor={game.homeTeamColor} // 🏠 Home team color
          homeColor={game.awayTeamColor} // ✈️ Away team color
        />
      )}

      {/* 🏆 Swapped Win Probability Bar (Pre-Game) */}
      {game.gameStatus === "pre" && game.awayTeamProjection !== null && (
        <div
          className="progress-container"
          style={{
            background: `linear-gradient(to right, #${game.homeTeamColor} ${
              100 - game.awayTeamProjection
            }%, #${game.awayTeamColor} ${100 - game.awayTeamProjection}%)`,
          }}
        >
          <span className="percentage-text">
            {Math.max(game.awayTeamProjection, 100 - game.awayTeamProjection)}%
          </span>
        </div>
      )}

      {/* 🏆 Swapped Win Probability Bar (In-Game) */}
      {game.gameStatus === "in" &&
        game.winProbabilities &&
        game.winProbabilities.awayWinPercentage !== undefined && (
          <div
            className="progress-container"
            style={{
              background: `linear-gradient(to right, #${game.homeTeamColor} ${
                100 - game.winProbabilities.awayWinPercentage * 100
              }%, #${game.awayTeamColor} ${
                100 - game.winProbabilities.awayWinPercentage * 100
              }%)`,
            }}
          >
            <span className="percentage-text">
              {Math.min(
                99,
                Math.round(
                  Math.max(
                    game.winProbabilities.homeWinPercentage,
                    game.winProbabilities.awayWinPercentage
                  ) * 100
                )
              )}
              %
            </span>
          </div>
        )}
    </div>
  );
};

export default GameCard;
