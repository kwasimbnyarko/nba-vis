import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import {useQueries, useQuery} from "@tanstack/react-query";
import {getPlayersPerTeam, getPlayerStatistics} from "../services/rapidApiNba";
import {STAT_CATEGORIES} from "../utils/constants";

const RadarChart = ({ players,
    gameSituation, quarter, statCategory,
                         dimensions = 400 }) => {
    const svgRef = useRef();

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

    const allPlayerData = useQueries({
        queries: players.map(player => ({
            queryKey:["playerData",player.playerId,statCategory],
            queryFn: async () => {
                const pStats = await getPlayerStatistics(player.playerId, statCategory)
                console.log(pStats)
                return {fullName:player.fullName, stats:pStats}
            }
            // staleTime: Infinity
        })),
        combine: (results) => {
            return {
                data : results.map(r => r.data),
                pending: results.map(r => r.isPending)
            }
        }
    })


    // const data = playerData

    useEffect(() => {
        console.log(allPlayerData.data)
    }, [allPlayerData]);

    // useEffect(() => {
    //
    //     if (!playerData.length) return;
    //
    //     console.log("data: ", data)
    //
    //     const svg = d3.select(svgRef.current);
    //     svg.selectAll("*").remove(); // Clear svg
    //
    //     const radius = dimensions / 2 - 40;
    //     const levels = 5; // How many rings
    //     const angleSlice = (Math.PI * 2) / data.length;
    //
    //     const rScale = d3.scaleLinear()
    //         .domain([0, d3.max(data, d => d.value)])
    //         .range([0, radius]);
    //
    //     const g = svg
    //         .attr("width", dimensions)
    //         .attr("height", dimensions)
    //         .append("g")
    //         .attr("transform", `translate(${dimensions/2}, ${dimensions/2})`);
    //
    //     // Draw circular grid
    //     for (let level = 0; level < levels; level++) {
    //         const r = radius * ((level + 1) / levels);
    //         g.append("circle")
    //             .attr("r", r)
    //             .attr("fill", "none")
    //             .attr("stroke", "#CDCDCD")
    //             .attr("stroke-dasharray", "2,2");
    //     }
    //
    //     // Draw axis lines
    //     data.forEach((d, i) => {
    //         const angle = angleSlice * i - Math.PI / 2;
    //         g.append("line")
    //             .attr("x1", 0)
    //             .attr("y1", 0)
    //             .attr("x2", radius * Math.cos(angle))
    //             .attr("y2", radius * Math.sin(angle))
    //             .attr("stroke", "#CDCDCD")
    //             .attr("stroke-width", 1);
    //
    //         // Labels
    //         g.append("text")
    //             .attr("x", (radius + 10) * Math.cos(angle))
    //             .attr("y", (radius + 10) * Math.sin(angle))
    //             .text(d.abbreviation)
    //             .style("font-size", "10px")
    //             .attr("text-anchor", "middle")
    //             .attr("dominant-baseline", "middle");
    //     });
    //
    //     const tooltip = d3.select("#tooltip");
    //
    //
    //     // Draw data area
    //     const radarLine = d3.lineRadial()
    //         .radius(d => rScale(d.value))
    //         .angle((d,i) => i * angleSlice)
    //         .curve(d3.curveLinearClosed);
    //
    //     g.append("path")
    //         .datum(data)
    //         .attr("d", radarLine)
    //         .attr("fill", "#00f")
    //         .attr("fill-opacity", 0.3)
    //         .attr("stroke", "#00f")
    //         .attr("stroke-width", 2);
    //
    //     // Draw data points
    //     g.selectAll(".radarCircle")
    //         .data(data)
    //         .enter()
    //         .append("circle")
    //         .attr("class", "radarCircle")
    //         .attr("r", 5)
    //         .attr("cx", d => rScale(d.value) * Math.cos(angleSlice * data.indexOf(d) - Math.PI/2))
    //         .attr("cy", d => rScale(d.value) * Math.sin(angleSlice * data.indexOf(d) - Math.PI/2))
    //         .attr("fill", "#00f")
    //         .on("mouseover", function (event, d) {
    //             tooltip
    //                 .style("display", "block")
    //                 .html(`<strong>${d.displayName}</strong><br/>Value: ${d.value}<br/>Desc: ${d.description}`);
    //         })
    //         .on("mousemove", function (event) {
    //             tooltip
    //                 .style("left", `${event.offsetX + 10}px`)
    //                 .style("top", `${event.offsetY - 20}px`);
    //         })
    //         .on("mouseout", function () {
    //             tooltip.style("display", "none");
    //         });
    //
    // }, [playerData]);

    return (
        <div style={{position: "relative"}}>
            <svg ref={svgRef}></svg>
            <div id="tooltip" style={{
                position: "absolute",
                backgroundColor: "white",
                padding: "4px 8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                pointerEvents: "none",
                fontSize: "12px",
                display: "none"
            }}></div>
        </div>
    )
};

export default RadarChart;
