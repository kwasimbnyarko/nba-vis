import React, {useRef, useEffect} from "react";
import * as d3 from "d3";
import {PLAYER_GRAPH_COLORS} from "../utils/constants.ts";

const RadarChart = ({
                        allPlayerData, dimensions = 400
                    }) => {
    const svgRef = useRef();
    const tooltipRef = useRef();

    /*
    * General
    * - Pts
    * - Assists
    * - Reb
    * - Minutes
    * - TS%
    *
    * Offence
    *  - Pts
    *  - Assists
    *  - TS%
    *  - Off Reb
    *  - usageRate
    *
    * Defense
    *  - Blocks
    *  - Steals
    *  - Def Reb
    *  - Contests
    * */

    const data = allPlayerData.data

    useEffect(() => {
        if (allPlayerData.pending || !data || !data.length || !data[0].stats?.length) return;

        console.log(data)

        
        const statCount = data[0].stats.length;
        const radius = dimensions / 2 - 40;
        const levels = 5;
        const angleSlice = (2 * Math.PI) / statCount;

        const statScales = data[0].stats.map((_, i) => {
            const values = data.map(p => p.stats[i].value);
            return d3.scaleLinear()
                .domain([0, d3.max(values)])
                .range([0, radius]);
        });

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg
            .attr("width", dimensions)
            .attr("height", dimensions)
            .append("g")
            .attr("transform", `translate(${dimensions / 2}, ${dimensions / 2})`);

        // Tooltip container
        const tooltip = d3.select(tooltipRef.current)
            .style("position", "absolute")
            .style("background", "white")
            .style("border", "1px solid #ccc")
            .style("padding", "6px 8px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("display", "none");

        // Circular grid
        for (let level = 0; level < levels; level++) {
            const r = radius * ((level + 1) / levels);
            g.append("circle")
                .attr("r", r)
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("stroke-dasharray", "2,2");
        }

        // Axes + labels
        data[0].stats.forEach((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            g.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", radius * Math.cos(angle))
                .attr("y2", radius * Math.sin(angle))
                .attr("stroke", "#999");

            g.append("text")
                .attr("x", (radius + 10) * Math.cos(angle))
                .attr("y", (radius + 10) * Math.sin(angle))
                .text(d.abbreviation)
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle");
        });

        const radarLine = d3.lineRadial()
            .radius((d, i) => statScales[i](d.value))
            .angle((_, i) => i * angleSlice)
            .curve(d3.curveLinearClosed);

        // const radarPlayerColors = d3.scaleOrdinal(d3.schemeCategory10);

        data.forEach((player, idx) => {
            // const playerColor = radarPlayerColors(idx);
            const playerColor = PLAYER_GRAPH_COLORS[idx];

            g.append("path")
                .datum(player.stats)
                .attr("d", radarLine)
                .attr("fill", playerColor)
                .attr("fill-opacity", 0.2)
                .attr("stroke", playerColor)
                .attr("stroke-width", 2);

            g.selectAll(`.circle-${idx}`)
                .data(player.stats)
                .enter()
                .append("circle")
                .attr("r", 3)
                .attr("cx", (d, i) => statScales[i](d.value) * Math.cos(angleSlice * i - Math.PI / 2))
                .attr("cy", (d, i) => statScales[i](d.value) * Math.sin(angleSlice * i - Math.PI / 2))
                .attr("fill", playerColor)
                .on("mouseover", function (event, d) {
                    const [x, y] = d3.pointer(event, svgRef.current);

                    tooltip
                        .style("display", "block")
                        .html(`
      <strong>${player.fullName}</strong><br/>
      <strong>${d.displayName}</strong>: ${d.value.toFixed(2)}<br/>
      <em>${d.description}</em>
    `)
                        .style("left", `${x + 10}px`)
                        .style("top", `${y - 20}px`);
                })
                .on("mouseout", function () {
                    tooltip.style("display", "none");
                });
        });
    }, [data]);

    return (
        <div style={{position: "relative"}}>
            <div ref={tooltipRef}></div>
            <svg ref={svgRef}></svg>
        </div>
    )
};

export default RadarChart;
