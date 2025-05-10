import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./PlayerPlusMinusPlot.css"; // Import CSS for styling

// Props interface for the PlayerPlusMinusPlot component
interface PlayerPlusMinusPlotProps {
    data: { x: number; y: number; GAME_DATE: string; MATCHUP: string; FINAL_SCORE: string}[]; // Scatter plot data
    width: number; // Width of the chart
    height: number; // Height of the chart
}

// Main PlayerPlusMinusPlot component
const PlayerPlusMinusPlot: React.FC<PlayerPlusMinusPlotProps> = ({ data, width, height }) => {
    const ref = useRef<SVGSVGElement>(null); // Reference to the SVG element

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear previous renders

        // Chart dimensions and margins
        const margin = { top: 60, right: 180, bottom: 50, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Scales for X and Y axes with padding
        const xPadding = 5;
        const yPadding = 5;
        const x = d3
            .scaleLinear()
            .domain([
                (d3.min(data, (d) => d.x) || 0) - xPadding,
                (d3.max(data, (d) => d.x) || 0) + xPadding,
            ])
            .range([0, innerWidth]);

        const y = d3
            .scaleLinear()
            .domain([
                (d3.min(data, (d) => d.y) || 0) - yPadding,
                (d3.max(data, (d) => d.y) || 0) + yPadding,
            ])
            .range([innerHeight, 0]);

        // Categorize data and assign colors
        const categorizedData = data.map((d) => {
            let category = "Neutral Impact";
            let color = "gray";

            if (d.y > 0 && d.x > d.y) {
                category = "Caused Win";
                color = "green";
            } else if (d.y < 0 && d.x < d.y) {
                category = "Caused Loss";
                color = "red";
            }

            return { ...d, category, color };
        });

        // Count the number of points in each category
        type Category = "Caused Win" | "Caused Loss" | "Neutral Impact";
        const categoryCounts: Record<Category, number> = categorizedData.reduce(
            (acc, d) => {
                acc[d.category as Category] = (acc[d.category as Category] || 0) + 1;
                return acc;
            },
            { "Caused Win": 0, "Caused Loss": 0, "Neutral Impact": 0 }
        );

        // Create a group element for the chart
        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add a border around the chart
        svg.append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", innerWidth)
            .attr("height", innerHeight)
            .attr("class", "chart-border");

        // Add gridlines
        const gridlinesX = d3.axisBottom(x).tickSize(-innerHeight).tickFormat(() => "");
        const gridlinesY = d3.axisLeft(y).tickSize(-innerWidth).tickFormat(() => "");

        g.append("g")
            .attr("class", "grid-line")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(gridlinesX);

        g.append("g")
            .attr("class", "grid-line")
            .call(gridlinesY);

        // Add bold quadrant lines
        g.append("line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y1", 0)
            .attr("y2", innerHeight)
            .attr("class", "quadrant-line");

        g.append("line")
            .attr("x1", 0)
            .attr("x2", innerWidth)
            .attr("y1", y(0))
            .attr("y2", y(0))
            .attr("class", "quadrant-line");

        // Add X-axis
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x).ticks(10))
            .append("text")
            .attr("x", innerWidth / 2)
            .attr("y", 40)
            .attr("class", "axis-label")
            .text("Player Plus/Minus");

        // Add Y-axis
        g.append("g")
            .call(d3.axisLeft(y).ticks(10))
            .append("text")
            .attr("x", -innerHeight / 2)
            .attr("y", -50)
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .text("Team Plus/Minus");

        // Add chart title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 30)
            .attr("class", "chart-title")
            .text("Player vs Team Plus/Minus Impact");

        // Add a tooltip div
        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "white")
            .style("border", "1px solid #ccc")
            .style("border-radius", "8px")
            .style("padding", "10px")
            .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
            .style("pointer-events", "none")
            .style("opacity", 0); // Initially hidden

        // Plot data points
        g.selectAll("circle")
            .data(categorizedData)
            .enter()
            .append("circle")
            .attr("cx", (d) => x(d.x))
            .attr("cy", (d) => y(d.y))
            .attr("r", 6)
            .attr("fill", (d) => d.color)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("opacity", 0.9)
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html(
                        `<strong>Date:</strong> ${d.GAME_DATE}<br>
                        <strong>Matchup:</strong> ${d.MATCHUP}<br>
                        <strong>Final Score:</strong> ${d.FINAL_SCORE}<br>
                        <strong>Team Plus/Minus:</strong> ${d.y}<br>
                        <strong>Player Plus/Minus:</strong> ${d.x}`
                    );
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        // Add subsection labels
        const xDomain = x.domain();
        const yDomain = y.domain();

        const labels = [
            {
                text: "Team Wins, Player Poor",
                x: x((xDomain[0] + 0) / 2),
                y: y((yDomain[1] + 0) / 2),
            },
            {
                text: "Team Wins, Player Good",
                x: x((0 + xDomain[1]) / 2),
                y: y((yDomain[1] + 0) / 2),
            },
            {
                text: "Team Loses, Player Poor",
                x: x((xDomain[0] + 0) / 2),
                y: y((0 + yDomain[0]) / 2),
            },
            {
                text: "Team Loses, Player Good",
                x: x((0 + xDomain[1]) / 2),
                y: y((0 + yDomain[0]) / 2),
            },
        ];

        labels.forEach((label) => {
            g.append("rect")
                .attr("x", label.x - 70)
                .attr("y", label.y - 15)
                .attr("width", 141)
                .attr("height", 25)
                .attr("class", "label-box");

            g.append("text")
                .attr("x", label.x)
                .attr("y", label.y)
                .attr("class", "label-text")
                .text(label.text);
        });

        // Add legend
        const legend = svg
            .append("g")
            .attr("transform", `translate(${width - 140},${margin.top})`);

        legend
            .append("rect")
            .attr("x", 0)
            .attr("y", -30)
            .attr("width", 140)
            .attr("height", 100)
            .attr("class", "legend-box");

        legend
            .append("text")
            .attr("x", 60)
            .attr("y", -15)
            .attr("class", "legend-label")
            .text("Legend");

        legend
            .append("circle")
            .attr("cx", 10)
            .attr("cy", 10)
            .attr("r", 6)
            .attr("fill", "green");

        legend
            .append("text")
            .attr("x", 25)
            .attr("y", 14)
            .attr("class", "legend-item")
            .text(`Caused Win (${categoryCounts["Caused Win"]})`);

        legend
            .append("circle")
            .attr("cx", 10)
            .attr("cy", 30)
            .attr("r", 6)
            .attr("fill", "red");

        legend
            .append("text")
            .attr("x", 25)
            .attr("y", 34)
            .attr("class", "legend-item")
            .text(`Caused Loss (${categoryCounts["Caused Loss"]})`);

        legend
            .append("circle")
            .attr("cx", 10)
            .attr("cy", 50)
            .attr("r", 6)
            .attr("fill", "gray");

        legend
            .append("text")
            .attr("x", 25)
            .attr("y", 54)
            .attr("class", "legend-item")
            .text(`Neutral Impact (${categoryCounts["Neutral Impact"]})`);

        // Clean up the tooltip on unmount
        return () => {
            tooltip.remove();
        };
    }, [data, width, height]);

    return <svg ref={ref} width={width} height={height}></svg>;
};

export default PlayerPlusMinusPlot;