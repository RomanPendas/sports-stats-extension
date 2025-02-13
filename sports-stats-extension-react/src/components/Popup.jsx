import React, { useEffect, useState } from "react";
import "./popup.css";
import GameCard from "./GameCard";

const Popup = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: "getLiveData" }, (data) => {
      console.log("Initial fetch data:", data);
      setGames(data || []);
    });

    const handleLiveDataUpdate = (message) => {
      if (message.action === "liveDataUpdated") {
        console.log("Popup: Received new data, updating frontend..");

        // Apply sorting before setting state
        const sortedGames = [...message.data].sort((a, b) => {
          const order = { in: 0, pre: 1, post: 2 };
          return order[a.gameStatus] - order[b.gameStatus];
        });

        setGames(sortedGames);
      }
    };

    chrome.runtime.onMessage.addListener(handleLiveDataUpdate);

    return () => {
      chrome.runtime.onMessage.removeListener(handleLiveDataUpdate);
    };
  }, []);

  return (
    <div id="gamesContainer">
      {games.map((game, index) => (
        <GameCard key={index} game={game} />
      ))}
    </div>
  );
};

export default Popup;
