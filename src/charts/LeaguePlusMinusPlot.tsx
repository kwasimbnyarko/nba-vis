import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./LeaguePlusMinusPlot.css"; // Import CSS for styling

// Props interface for the LeaguePlusMinusPlotProps component
interface LeaguePlusMinusPlotProps {
    data: { PLAYER_NAME: string; total_plus_minus: number }[]; // Bar chart data
    width: number; // Width of the chart
    height: number; // Height of the chart
    onBarClick?: (playerName: string) => void; // Callback for bar click
}

// Main LeaguePlusMinusPlot component
const LeaguePlusMinusPlot: React.FC<LeaguePlusMinusPlotProps> = ({ data, width, height, onBarClick }) => {
    const svgRef = useRef<SVGSVGElement>(null); // Reference to the SVG element

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous renders

        // Chart dimensions and margins
        const margin = { top: 50, right: 30, bottom: 150, left: 100 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Calculate the Y-axis domain to include negative values
        const yMin = d3.min(data, (d) => d.total_plus_minus) || 0;
        const yMax = d3.max(data, (d) => d.total_plus_minus) || 0;

        // Scales for X and Y axes
        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.PLAYER_NAME))
            .range([0, innerWidth])
            .padding(0.2);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.total_plus_minus) || 0])
            .nice()
            .range([innerHeight, 0]);

        // Create a group element for the chart
        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        // Add X-axis
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll("text")
            .attr("class", "x-axis-label")
            // Adjust for negative values
            .attr("dy", function (d: any) {
                const playerData = data.find((p) => p.PLAYER_NAME === d);
                return playerData && playerData.total_plus_minus < 0 ? "-1em" : "1em";
            })
            .attr("dx", function (d: any) {
                const playerData = data.find((p) => p.PLAYER_NAME === d);
                return playerData && playerData.total_plus_minus < 0 ? "1em" : "0";
            })
            .style("text-anchor", (d: any) => {
                const playerData = data.find((p) => p.PLAYER_NAME === d);
                return playerData && playerData.total_plus_minus < 0 ? "start" : "end";
            });

        // Add X-axis label
        g.append("text")
            .attr("class", "x-axis-title")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + 120)
            .text("Players");

        // Add Y-axis
        g.append("g").call(d3.axisLeft(y).ticks(10));

        // Add Y-axis label
        g.append("text")
            .attr("class", "y-axis-title")
            .attr("x", -innerHeight / 2)
            .attr("y", -60)
            .attr("transform", "rotate(-90)")
            .text("Total Plus/Minus");

        // Add bars
        g.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.PLAYER_NAME) || 0)
            // Adjust for negative values
            .attr("y", (d) => (d.total_plus_minus >= 0 ? y(d.total_plus_minus) : y(0))) 
            .attr("width", x.bandwidth())
            .attr("height", (d) =>
                d.total_plus_minus >= 0
                    ? innerHeight - y(d.total_plus_minus)
                    : y(d.total_plus_minus) - y(0)
            )
            .on("click", (event, d) => {
                if (onBarClick) onBarClick(d.PLAYER_NAME);
            });

        // Add chart title
        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2)
            .attr("y", 20)
            .text("Top Players by Total Plus/Minus");
    }, [data, width, height, onBarClick]);

    return <svg ref={svgRef} width={width} height={height} className="league-plus-minus-plot" />;
};

export default LeaguePlusMinusPlot;