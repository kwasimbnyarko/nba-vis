import React, { useEffect, useState } from "react";
import ShotChartPlot from "../charts/ShotChartPlot";
import axios from "axios";

const ShotChartPage: React.FC = () => {
    // State variables for data, loading, error, team name, player name, and season
    const [data, setData] = useState<{ LOC_X: number; LOC_Y: number; SHOT_MADE_FLAG: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [team, setTeamName] = useState<string>("Atlanta Hawks");
    const [season, setSeason] = useState<string>("2024-25");
    const [playerName, setPlayerName] = useState<string>("Stephen Curry");
    const [inputPlayerName, setInputPlayerName] = useState<string>("Stephen Curry");
    const [playersOnTeam, setPlayersOnTeam] = useState<string[]>([]);

    // List of available seasons
    const seasons = [
        "2024-25",
        "2023-24",
        "2022-23",
        "2021-22",
        "2020-21",
        "2019-20",
        "2018-19",
        "2017-18",
        "2016-17",
        "2015-16"
    ];

    // List of available teams
    const teams = [
        "Atlanta Hawks",
        "Boston Celtics",
        "Brooklyn Nets",
        "Charlotte Hornets",
        "Chicago Bulls",
        "Cleveland Cavaliers",
        "Dallas Mavericks",
        "Denver Nuggets",
        "Detroit Pistons",
        "Golden State Warriors",
        "Houston Rockets",
        "Indiana Pacers",
        "Los Angeles Clippers",
        "Los Angeles Lakers",
        "Memphis Grizzlies",
        "Miami Heat",
        "Milwaukee Bucks",
        "Minnesota Timberwolves",
        "New Orleans Pelicans",
        "New York Knicks",
        "Oklahoma City Thunder",
        "Orlando Magic",
        "Philadelphia 76ers",
        "Phoenix Suns",
        "Portland Trail Blazers",
        "Sacramento Kings",
        "San Antonio Spurs",
        "Toronto Raptors",
        "Utah Jazz",
        "Washington Wizards",
    ];

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/team-players", {
                    params: {
                        team_name: team,
                        season: season,
                    },
                });
    
                const players = response.data;
                setPlayersOnTeam(players);

                 // Only auto-set if current player is not in the new list
                if (!players.includes(playerName)) {
                    setInputPlayerName(players[0]);
                    setPlayerName(players[0]);
                }
    
            } catch (err) {
                console.error("Error fetching players:", err);
                setPlayersOnTeam([]);
            }
        };

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
    
                // API request to fetch player shot chart data
                const response = await axios.get("http://127.0.0.1:5000/player-shot-chart", {
                    params: {
                        player_name: playerName,
                        season: season,
                    },
                });
    
                // Update shot chart data
                setData(response.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data. Please try again later."); // Set error message
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        fetchPlayers();
        fetchData();
    }, [team, playerName, season]);

    // Handle changes to the season dropdown
    const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTeamName(event.target.value); // Update Team state
    };

    // Handle changes to the season dropdown
    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSeason(event.target.value); // Update season state
    };

    // Show loading or error messages if applicable
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: "2rem" }}>
            {/* team Name dropdown */}
            <div style={{ marginBottom: "2rem" }}>
                <label htmlFor="team-name" style={{ marginRight: "1rem" }}>
                    Team Name:
                </label>
                <select
                    id="team-name"
                    value={team}
                    onChange={handleTeamChange}
                    style={{
                        padding: "0.5rem",
                        fontSize: "1rem",
                    }}
                >
                    {teams.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {/* Player Dropdown */}
            <div style={{ marginBottom: "2rem" }}>
                <label htmlFor="player-select" style={{ marginRight: "1rem" }}>
                    Player:
                </label>
                <select
                    id="player-select"
                    value={inputPlayerName}
                    onChange={(e) => {
                        setInputPlayerName(e.target.value);
                        setPlayerName(e.target.value);
                    }}
                    style={{
                        padding: "0.5rem",
                        fontSize: "1rem",
                    }}
                >
                    {playersOnTeam.map((player) => (
                        <option key={player} value={player}>
                            {player}
                        </option>
                    ))}
                </select>
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
                    {seasons.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {/* ShotChartPlot Visualization */}
            <ShotChartPlot data={data} width={800} height={600} />
        </div>
    );
};

export default ShotChartPage;