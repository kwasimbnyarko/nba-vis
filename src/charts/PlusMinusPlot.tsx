import React from "react";
import * as d3 from "d3";
import "./PlusMinusPlot.css"; // Import CSS for styling

// Props interface for the PlusMinusPlot component
interface PlusMinusPlotProps {
    data: { x: number; y: number; win: boolean }[]; // Scatter plot data
    width: number; // Width of the chart
    height: number; // Height of the chart
}

// Main PlusMinusPlot component
const PlusMinusPlot: React.FC<PlusMinusPlotProps> = ({ data, width, height }) => {
    const ref = React.useRef<SVGSVGElement>(null); // Reference to the SVG element

    React.useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear previous renders

        // Chart dimensions and margins
        const margin = { top: 60, right: 150, bottom: 50, left: 60 };
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
            .text("Player vs Team Plus/Minus");

        // Plot data points
        g.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => x(d.x))
            .attr("cy", (d) => y(d.y))
            .attr("r", 6)
            .attr("class", (d) => (d.win ? "circle-win" : "circle-loss"))
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("opacity", 0.9);

        // Add subsection labels
        const xDomain = x.domain();
        const yDomain = y.domain();

        const labels = [
            {
                text: "Team Good, Player Poor",
                x: x((xDomain[0] + 0) / 2),
                y: y((yDomain[1] + 0) / 2),
            },
            {
                text: "Team & Player Good",
                x: x((0 + xDomain[1]) / 2),
                y: y((yDomain[1] + 0) / 2),
            },
            {
                text: "Both Performed Poorly",
                x: x((xDomain[0] + 0) / 2),
                y: y((0 + yDomain[0]) / 2),
            },
            {
                text: "Player Good, Team Poor",
                x: x((0 + xDomain[1]) / 2),
                y: y((0 + yDomain[0]) / 2),
            },
        ];

        labels.forEach((label) => {
            g.append("rect")
                .attr("x", label.x - 70)
                .attr("y", label.y - 15)
                .attr("width", 140)
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
            .attr("transform", `translate(${width - 110},${margin.top})`);

        legend
            .append("rect")
            .attr("x", 0)
            .attr("y", -30)
            .attr("width", 80)
            .attr("height", 75)
            .attr("class", "legend-box");

        legend
            .append("text")
            .attr("x", 40)
            .attr("y", -15)
            .attr("class", "legend-label")
            .text("Legend");

        legend
            .append("circle")
            .attr("cx", 10)
            .attr("cy", 10)
            .attr("r", 6)
            .attr("class", "circle-win");

        legend
            .append("text")
            .attr("x", 25)
            .attr("y", 14)
            .attr("class", "legend-item")
            .text("Win");

        legend
            .append("circle")
            .attr("cx", 10)
            .attr("cy", 30)
            .attr("r", 6)
            .attr("class", "circle-loss");

        legend
            .append("text")
            .attr("x", 25)
            .attr("y", 34)
            .attr("class", "legend-item")
            .text("Loss");
    }, [data, width, height]);

    return <svg ref={ref} width={width} height={height}></svg>;
};

export default PlusMinusPlot;
