import React, { useEffect, useState } from "react";
import axios from "axios";
import LeaguePlusMinusPlot from "../charts/LeaguePlusMinusPlot";
import { useNavigate } from "react-router-dom";

const LeaguePlusMinusPage: React.FC = () => {
    // State variables for data, loading, error, dropdown selections, and teams
    const [data, setData] = useState<{ PLAYER_NAME: string; total_plus_minus: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [season, setSeason] = useState("2024-25");
    const [team, setTeam] = useState("");
    const [teams, setTeams] = useState<{ name: string; abbreviation: string }[]>([]);
    const navigate = useNavigate();

    // List of available seasons. TODO don't hardcode
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
        "2015-16",
    ];

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

    // Fetch list of teams
    const fetchTeams = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/teams");
            setTeams(response.data); 
        } catch (err) {
            console.error("Error fetching teams:", err);
            setError("Failed to fetch teams. Please try again later.");
        }
    };

    // Fetch data whenever season or team changes
    useEffect(() => {
        fetchData();
    }, [season, team]);

    // Fetch teams on component mount
    useEffect(() => {
        fetchTeams();
    }, []);

    // Handle bar click to navigate to the player's page
    const handleBarClick = (playerName: string) => {
        navigate(`/player-plus-minus?player_name=${encodeURIComponent(playerName)}`);
    };

    // Show loading or error messages if applicable
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: "2rem" }}>
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
                    {seasons.map((s) => (
                        <option key={s} value={s}>
                            {s}
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