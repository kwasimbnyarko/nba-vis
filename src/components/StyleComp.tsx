import React from "react";
import RadarChart from "../charts/RadarChart";
import {useQueries} from "@tanstack/react-query";
import {getPlayerStatistics} from "../services/rapidApiNba";
import {getPlayerOrTeamStats} from "../services/myServerCalls";
import {QUARTERS} from "../utils/constants";

interface StyleCompProps {
    players:any[],
    teams: any[],
    isComparingTeams: boolean,
    gameSituation:string,
    quarter:string,
    statCategory:string,
    dimensions:number
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

    // getPlayerOrTeamStats(players[0].playerId,0,"off",0).then(r => console.log(r))



    const allPlayerData = useQueries({
        queries: players.map(player => ({
            queryKey: [
                "playerData",
                player.PLAYER_ID,
                statCategory,QUARTERS.indexOf(quarter)],
            queryFn: async () => {
                const pStats = await
                    getPlayerOrTeamStats(
                        player.PLAYER_ID,
                        0,
                        statCategory,
                    QUARTERS.indexOf(quarter))
                console.log(pStats)
                return {fullName: player.PLAYER_NAME, stats: pStats}
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
