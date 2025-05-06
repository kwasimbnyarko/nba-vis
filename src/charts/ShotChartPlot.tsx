import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./ShotChartPlot.css"; // Import CSS for styling

// Props interface for the ShotChartPlot component
interface ShotChartPlotProps {
    data: { LOC_X: number; LOC_Y: number; SHOT_MADE_FLAG: number }[]; // Shot chart data
    width: number; // Width of the chart
    height: number; // Height of the chart
}

// Main ShotChartPlot component
const ShotChartPlot: React.FC<ShotChartPlotProps> = ({ data, width, height }) => {
    const svgRef = useRef<SVGSVGElement>(null); // Reference to the SVG element

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous renders

        // Scale shot locations
        const xScale = d3.scaleLinear().domain([-250, 250]).range([0, width]);
        const yScale = d3.scaleLinear().domain([0, 470]).range([height, 0]);

        // Plot individual shots
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(d.LOC_X))
            .attr("cy", (d) => yScale(d.LOC_Y))
            .attr("r", 4)
            .attr("class", "shot-circle")
            .attr("fill", (d) => (d.SHOT_MADE_FLAG ? "green" : "red"));

        // Add a legend
        svg.append("circle")
            .attr("cx", 20)
            .attr("cy", 20)
            .attr("r", 5)
            .attr("class", "legend-circle")
            .attr("fill", "green");

        svg.append("text")
            .attr("x", 30)
            .attr("y", 25)
            .attr("class", "legend-text")
            .text("Made Shot");

        svg.append("circle")
            .attr("cx", 20)
            .attr("cy", 40)
            .attr("r", 5)
            .attr("class", "legend-circle")
            .attr("fill", "red");

        svg.append("text")
            .attr("x", 30)
            .attr("y", 45)
            .attr("class", "legend-text")
            .text("Missed Shot");
    }, [data, width, height]);

    return <svg ref={svgRef} width={width} height={height} className="shot-chart-svg" />;
};

export default ShotChartPlot;