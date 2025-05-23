import React, { useEffect, useState } from "react";
import axios from "axios";
import LeaguePlusMinusPlot from "../charts/LeaguePlusMinusPlot";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../context/TeamsContext";
import { useSeasons } from "../context/SeasonsContext";

const LeaguePlusMinusPage: React.FC = () => {
    // State variables for data, loading, error, and dropdown selections
    const [data, setData] = useState<{ PLAYER_NAME: string; total_plus_minus: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [season, setSeason] = useState("2024-25");
    const [team, setTeam] = useState("");

    // Access teams and seasons from context
    const { teams, loading: teamsLoading, error: teamsError } = useTeams();
    const { seasons, loading: seasonsLoading, error: seasonsError } = useSeasons();

    const navigate = useNavigate();

    // Fetch league plus-minus data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get("http://127.0.0.1:5000/league-plus-minus", {
                params: { season, team },
            });

            setData(response.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data whenever season or team changes
    useEffect(() => {
        fetchData();
    }, [season, team]);

    // Handle bar click to navigate to the player's page
    const handleBarClick = (playerName: string) => {
        navigate(`/player-plus-minus?player_name=${encodeURIComponent(playerName)}&season=${encodeURIComponent(season)}`);
    };

    // Show loading or error messages if applicable
    if (teamsLoading) return <div>Loading teams...</div>;
    if (teamsError) return <div>{teamsError}</div>;
    if (seasonsLoading) return <div>Loading seasons...</div>;
    if (seasonsError) return <div>{seasonsError}</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: "2rem" }}>
            <button
                onClick={() => navigate("/")}
                style={{
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginBottom: "1rem",
                }}
            >
                Back to Home
            </button>
            <h2 style={{ textAlign: "center" }}>League Plus Minus</h2>
            {/* Season Dropdown */}
            <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="season" style={{ marginRight: "1rem" }}>
                    Season:
                </label>
                <select
                    id="season"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    style={{
                        padding: "0.25rem",
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

            {/* Team Dropdown */}
            <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="team-select" style={{ marginRight: "1rem" }}>
                    Team:
                </label>
                <select
                    id="team-select"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    style={{
                        padding: "0.25rem",
                        fontSize: "1rem",
                    }}
                >
                    <option value="">All Teams</option>
                    {teams.map((t) => (
                        <option key={t.abbreviation} value={t.abbreviation}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* LeaguePlusMinusPlot Bar Chart */}
            <LeaguePlusMinusPlot
                data={data}
                width={1000}
                height={600}
                onBarClick={handleBarClick}
            />
        </div>
    );
};

export default LeaguePlusMinusPage;