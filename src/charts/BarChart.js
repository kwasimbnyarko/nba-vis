import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data, dimensions = { width: 800, height: 400 } }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); 

        const { width, height } = dimensions;
        const margin = { top: 20, right: 30, bottom: 50, left: 50 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        // Create scales
        const xScale = d3
            .scaleBand()
            .domain(data.map(d => d.name)) 
            .range([0, chartWidth])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.value)]) 
            .nice()
            .range([chartHeight, 0]);

        // Create chart group
        const chart = svg
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Draw bars
        chart
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.name))
            .attr("y", d => yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", d => chartHeight - yScale(d.value))
            .attr("fill", "#00f")
            .on("click", (event, d) => {
                console.log(`Clicked on ${d.name}`);
            });

        // Add x-axis
        chart
            .append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add y-axis
        chart.append("g").call(d3.axisLeft(yScale));

        // Add axis labels
        svg
            .append("text")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .attr("text-anchor", "middle")
            .text("Players");

        svg
            .append("text")
            .attr("x", -height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Value");

    }, [data, dimensions]);

    return <svg ref={svgRef}></svg>;
};

export default BarChart;