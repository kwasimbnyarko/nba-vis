import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PlusMinusPlot from "../charts/PlayerPlusMinusPlot";
import axios from "axios";
import { useSeasons } from "../context/SeasonsContext";

const PlayerPlusMinusPage: React.FC = () => {
    // State variables for data, loading, error, player name, and season
    const [data, setData] = useState<{ x: number; y: number; win: boolean; GAME_DATE: string; MATCHUP: string; FINAL_SCORE: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [season, setSeason] = useState<string>("2024-25");
    const [inputPlayerName, setInputPlayerName] = useState<string>("");

    // Access seasons from context
    const { seasons, loading: seasonsLoading, error: seasonsError } = useSeasons();

    // Extract query parameters from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const queryPlayerName = queryParams.get("player_name");
    const querySeason = queryParams.get("season");

    // Update playerName and season from query parameters if available
    useEffect(() => {
        if (queryPlayerName) {
            setPlayerName(queryPlayerName);
            setInputPlayerName(queryPlayerName);
        }
        if (querySeason) {
            setSeason(querySeason);
        }
    }, [queryPlayerName, querySeason]);


    // Fetch data from the backend API
    const fetchData = async () => {
        if (!playerName)
            // Skip fetch if playerName is not set
            return;

        try {
            setLoading(true);
            setError(null);

            // API request to fetch player plus-minus data
            const response = await axios.get("http://127.0.0.1:5000/player-plus-minus", {
                params: {
                    player_name: playerName,
                    season: season,
                },
            });

            // Transform API response into scatter plot data
            const scatterData = response.data.map((game: any) => ({
                x: game.PLUS_MINUS, // Player Plus/Minus
                y: game.POINT_DIFF, // Team Point Difference
                win: game.WL === "W", // Win or Loss
                GAME_DATE: game.GAME_DATE, // Game Date
                MATCHUP: game.MATCHUP, // Matchup
                FINAL_SCORE: game.FINAL_SCORE, // Final Score
            }));

            // Update state
            setData(scatterData);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data. Please try again later."); // Set error message
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    // Fetch data whenever playerName or season changes
    useEffect(() => {
        fetchData();
    }, [playerName, season]);

    // Handle changes to the player name input
    const handlePlayerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputPlayerName(event.target.value); // Update input state
    };

    // Update playerName state when Enter key is pressed
    const handlePlayerNameSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            setPlayerName(inputPlayerName); // Set player name
        }
    };

    // Handle changes to the season dropdown
    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSeason(event.target.value); // Update season state
    };

    // Show loading or error messages if applicable
    if (seasonsLoading) return <div>Loading seasons...</div>;
    if (seasonsError) return <div>{seasonsError}</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2 style={{textAlign:"center"}}>Player Plus Minus</h2>
            {/* Player Name Input */}
            <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="player-name" style={{ marginRight: "1rem" }}>
                    Player Name:
                </label>
                <input
                    id="player-name"
                    type="text"
                    value={inputPlayerName}
                    onChange={handlePlayerNameChange}
                    onKeyDown={handlePlayerNameSubmit}
                    placeholder="Enter player name"
                    style={{
                        padding: "0.5rem",
                        fontSize: "1rem",
                        width: "300px",
                    }}
                />
            </div>

            {/* Season Dropdown */}
            <div style={{ marginBottom: "2rem" }}>
                <label htmlFor="season" style={{ marginRight: "1rem" }}>
                    Season:
                </label>
                <select
                    id="season"
                    value={season}
                    onChange={handleSeasonChange}
                    style={{
                        padding: "0.5rem",
                        fontSize: "1rem",
                    }}
                >
                    {seasons.map((season) => (
                        <option key={season} value={season}>
                            {season}
                        </option>
                    ))}
                </select>
            </div>

            {/* PlusMinusPlot Scatter Plot */}
            <PlusMinusPlot
                data={data}
                width={900}
                height={600}
            />
        </div>
    );
};

export default PlayerPlusMinusPage;
