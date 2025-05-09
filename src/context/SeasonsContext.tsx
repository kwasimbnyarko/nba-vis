import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Define the shape of the context
interface SeasonsContextType {
    seasons: string[];
    loading: boolean;
    error: string | null;
}

// Create the context
const SeasonsContext = createContext<SeasonsContextType | undefined>(undefined);

// Provider component
export const SeasonsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [seasons, setSeasons] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if seasons are already stored in localStorage
                const storedSeasons = localStorage.getItem("seasons");
                if (storedSeasons) {
                    setSeasons(JSON.parse(storedSeasons));
                    setLoading(false);
                    return;
                }

                // Fetch seasons from the backend
                const response = await axios.get("http://127.0.0.1:5000/seasons");
                setSeasons(response.data);

                // Store seasons in localStorage
                localStorage.setItem("seasons", JSON.stringify(response.data));
            } catch (err) {
                console.error("Error fetching seasons:", err);
                setError("Failed to fetch seasons. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSeasons();
    }, []);

    return (
        <SeasonsContext.Provider value={{ seasons, loading, error }}>
            {children}
        </SeasonsContext.Provider>
    );
};

// Custom hook to use the SeasonsContext
export const useSeasons = (): SeasonsContextType => {
    const context = useContext(SeasonsContext);
    if (!context) {
        throw new Error("useSeasons must be used within a SeasonsProvider");
    }
    return context;
};