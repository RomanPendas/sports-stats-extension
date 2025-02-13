let liveSportsData = [];

// let sportCategory = "soccer";
// let sportLeague = "uefa.champions";
let sportCategory = "basketball";
let sportLeague = "nba";

// Fetch live data from the ESPN API
// Get by date: https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=YYYYMMDD
const fetchLiveData = async () => {
  try {
    // Fetch the scoreboard data
    const response = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/${sportCategory}/${sportLeague}/scoreboard`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch scoreboard data: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Use Promise.all to fetch additional details for each match concurrently
    liveSportsData = await Promise.all(
      data.events.map(async (event) => {
        try {
          const matchId = event.id;
          const gameStatus = event.status.type.state; // "pre", "in", "post"

          let gameProjection = null;

          // Only fetch the game projection if the game is in "pre" status
          if (gameStatus === "pre") {
            const summaryResponse = await fetch(
              `https://site.api.espn.com/apis/site/v2/sports/${sportCategory}/${sportLeague}/summary?event=${matchId}`
            );

            if (!summaryResponse.ok) {
              throw new Error(
                `Failed to fetch game summary for match ID ${matchId}: ${summaryResponse.statusText}`
              );
            }

            const summaryData = await summaryResponse.json();
            gameProjection =
              summaryData.predictor?.awayTeam?.gameProjection || null;
          }

          // Return the combined data for this match
          return {
            matchId: matchId,
            sportCategory: sportCategory,
            homeTeamName: event.competitions[0].competitors[0].team.displayName,
            homeTeamRecord:
              event.competitions[0].competitors[0].records[0].summary,
            homeTeamScore: event.competitions[0].competitors[0].score,
            homeTeamColor: isTooLight(
              event.competitions[0].competitors[0].team.color
            )
              ? event.competitions[0].competitors[0].team.alternateColor
              : event.competitions[0].competitors[0].team.color,
            homeTeamLogo: event.competitions[0].competitors[0].team.logo,
            awayTeamName: event.competitions[0].competitors[1].team.displayName,
            awayTeamRecord:
              event.competitions[0].competitors[1].records[0].summary,
            awayTeamScore: event.competitions[0].competitors[1].score,
            awayTeamColor: isTooLight(
              event.competitions[0].competitors[1].team.color
            )
              ? event.competitions[0].competitors[1].team.alternateColor
              : event.competitions[0].competitors[1].team.color,
            awayTeamLogo: event.competitions[0].competitors[1].team.logo,
            date: event.date,
            gameStatus: gameStatus, // "pre", "in", "post"
            gameStatusDetailedDesc: event.status.type.name,
            gamePeriod: event.status.period || null,
            gameClock: event.status.displayClock,
            venueData: event.competitions[0].venue,
            winProbabilities:
              event.competitions[0].situation?.lastPlay?.probability || [],
            awayTeamProjection: gameProjection,
          };
        } catch (error) {
          console.error(
            `Error processing event ID ${event.id}: ${error.message}`
          );
          return null; // Skip this event
        }
      })
    );

    // Filter out any null values in case of failed fetches
    liveSportsData = liveSportsData.filter((match) => match !== null);

    // Notify all open popups with the latest data
    notifyPopups();
  } catch (error) {
    console.error(`Error fetching live data: ${error.message}`);
  }
};

const notifyPopups = () => {
  chrome.runtime
    .sendMessage({ action: "liveDataUpdated", data: liveSportsData })
    .then(() => {
      console.log("Background worker: Sent live data update to popup");
    })
    .catch((error) => {
      // No active listeners (Popup not open)
      console.warn(
        "No active popup to receive live data updates:",
        error.message
      );
    });
};

// Call fetchLiveData once on startup
fetchLiveData();

// Update data every 15 seconds
setInterval(fetchLiveData, 15000);

// Listen for manual requests from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLiveData") {
    sendResponse(liveSportsData);
  }
});

// Function to check if a color is too light
function isTooLight(hex, threshold = 0.8) {
  // Remove the hash symbol if present
  hex = hex.replace("#", "");

  // Convert 3-digit hex to 6-digit hex
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Calculate relative luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Check if luminance exceeds the threshold
  return luminance > threshold;
}

let availableSportsLeagues = {
  soccer: [
    { apiName: "uefa.champions", displayName: "UEFA Champions League" },
    { apiName: "eng.1", displayName: "English Premier League" },
    { apiName: "usa.1", displayName: "MLS" },
  ],
  football: [{ apiName: "nfl", displayName: "NFL" }],
  basketball: [
    { apiName: "nba", displayName: "NBA" },
    { apiName: "wnba", displayName: "WNBA" },
    { apiName: "mens-college-basketball", displayName: "NCAAM" },
    { apiName: "womens-college-basketball", displayName: "NCAAW" },
  ],
  hockey: [{ apiName: "nhl", displayName: "NHL" }],
  baseball: [{ apiName: "mlb", displayName: "MLB" }],
};
