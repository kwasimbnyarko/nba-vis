import React from "react";
import RadarChart from "../charts/RadarChart";
import {useQueries} from "@tanstack/react-query";
import {getPlayerStatistics} from "../services/rapidApiNba";

interface StyleCompProps {
    players:any[], gameSituation:string, quarter:string, statCategory:string, dimensions:number
}
const StyleComp = ({
                       players,
                      gameSituation, quarter, statCategory,
                    }:StyleCompProps) => {

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
            queryKey: ["playerData", player.playerId, statCategory],
            queryFn: async () => {
                const pStats = await getPlayerStatistics(player.playerId, statCategory)
                console.log(pStats)
                return {fullName: player.fullName, stats: pStats}
            },
            staleTime: Infinity
        })),
        combine: (results) => {
            return {
                data: results.map(r => r.data),
                pending: results.some(r => r.isPending)
            }
        }
    })

        return (
        <div>
            <RadarChart allPlayerData={allPlayerData}/>
            <RadarChart allPlayerData={allPlayerData}/>
        </div>
    )
};

export default StyleComp;
