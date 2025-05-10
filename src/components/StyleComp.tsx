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
                        teams,
                        isComparingTeams,
                        gameSituation,
                       quarter, statCategory,
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

    const allTeamData = useQueries({
        queries: teams.map(team => ({
            enabled: !!teams.length,
            queryKey: [
                "teamData",
                team.id,
                statCategory,
                gameSituation,
                QUARTERS.indexOf(quarter)],
            queryFn: async () => {
                console.log(teams)
                const tStats = await
                    getPlayerOrTeamStats(
                        0,
                        team.id,
                        statCategory,
                        gameSituation,
                        QUARTERS.indexOf(quarter))
                console.log(tStats)
                return {fullName: team.name, stats: tStats}
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

    const allPlayerData = useQueries({
        queries: players.map(player => ({
            enabled: !!players.length,
            queryKey: [
                "playerData",
                player.PLAYER_ID,
                statCategory,
                gameSituation,
                QUARTERS.indexOf(quarter)],
            queryFn: async () => {
                const pStats = await
                    getPlayerOrTeamStats(
                        player.PLAYER_ID,
                        0,
                        statCategory,
                    gameSituation,
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
            <RadarChart allPlayerData={
                isComparingTeams ?
                    allTeamData :
                    allPlayerData
            }/>
        </div>
    )
};

export default StyleComp;
