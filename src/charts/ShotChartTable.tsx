import React, { useState } from "react";
import "./ShotChartTable.css"; // Import CSS for styling

// Props interface for the ShotChartTableProps component
interface ShotChartTableProps {
    shootingPercentages: {
        zone_basic: { SHOT_ZONE_BASIC: string; attempted_shots: number; made_shots: number; shooting_percentage: number }[];
        zone_area: { SHOT_ZONE_AREA: string; attempted_shots: number; made_shots: number; shooting_percentage: number }[];
        zone_range: { SHOT_ZONE_RANGE: string; attempted_shots: number; made_shots: number; shooting_percentage: number }[];
    };
}

// Main ShotChartTable component
const ShotChartTable: React.FC<ShotChartTableProps> = ({ shootingPercentages }) => {
    const [filter, setFilter] = useState<"zone_basic" | "zone_area" | "zone_range">("zone_basic");

    // Get the data based on the selected filter
    const filteredData =
        filter === "zone_basic"
            ? shootingPercentages.zone_basic
            : filter === "zone_area"
            ? shootingPercentages.zone_area
            : shootingPercentages.zone_range;

    // Find the maximum attempted shots
    const maxAttempted = Math.max(...filteredData.map((zone) => zone.attempted_shots));

    return (
        <div className="shot-chart-table-container">
            <h3>Shooting Percentages</h3>

            {/* Dropdown to filter between zone types */}
            <div className="filter-container">
                <label htmlFor="filter-select">Filter By Zone:</label>
                <select
                    id="filter-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as "zone_basic" | "zone_area" | "zone_range")}
                >
                    <option value="zone_basic">Basic</option>
                    <option value="zone_area">Area</option>
                    <option value="zone_range">Range</option>
                </select>
            </div>

            {/* Table to display the filtered data */}
            <table className="shot-chart-table">
                <thead>
                    <tr>
                        <th>{filter === "zone_basic" ? "Zone" : filter === "zone_area" ? "Area" : "Range"}</th>
                        <th>Attempted</th>
                        <th>Made</th>
                        <th>Shooting %</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((zone, index) => (
                        <tr key={index}>
                            <td>
                                {filter === "zone_basic"
                                    ? (zone as { SHOT_ZONE_BASIC: string }).SHOT_ZONE_BASIC
                                    : filter === "zone_area"
                                    ? (zone as { SHOT_ZONE_AREA: string }).SHOT_ZONE_AREA
                                    : (zone as { SHOT_ZONE_RANGE: string }).SHOT_ZONE_RANGE}
                            </td>
                            <td
                                className={`attempted-cell ${
                                    zone.attempted_shots === maxAttempted ? "max-attempted" : ""
                                }`}
                            >
                                {zone.attempted_shots}
                            </td>
                            <td>{zone.made_shots}</td>
                            <td className={`percentage-cell ${getPercentageClass(zone.shooting_percentage)}`}>
                                {zone.shooting_percentage.toFixed(1)}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Helper function to determine the CSS class for shooting percentage
const getPercentageClass = (percentage: number): string => {
    if (percentage >= 50) return "high-percentage";
    if (percentage >= 30) return "medium-percentage";
    return "low-percentage";
};

export default ShotChartTable;