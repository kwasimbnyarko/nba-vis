import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Define the shape of the context
interface TeamsContextType {
    teams: { name: string; abbreviation: string }[];
    loading: boolean;
    error: string | null;
}

// Create the context
const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

// Provider component
export const TeamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [teams, setTeams] = useState<{ name: string; abbreviation: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if teams are already stored in localStorage
                const storedTeams = localStorage.getItem("teams");
                if (storedTeams) {
                    setTeams(JSON.parse(storedTeams));
                    setLoading(false);
                    return;
                }

                // Fetch teams from the backend
                const response = await axios.get("http://127.0.0.1:5000/teams");
                setTeams(response.data);

                // Store teams in localStorage
                localStorage.setItem("teams", JSON.stringify(response.data));
            } catch (err) {
                console.error("Error fetching teams:", err);
                setError("Failed to fetch teams. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    return (
        <TeamsContext.Provider value={{ teams, loading, error }}>
            {children}
        </TeamsContext.Provider>
    );
};

// Custom hook to use the TeamsContext
export const useTeams = (): TeamsContextType => {
    const context = useContext(TeamsContext);
    if (!context) {
        throw new Error("useTeams must be used within a TeamsProvider");
    }
    return context;
};