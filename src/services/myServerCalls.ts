/**
 * Basic api calls
 */

import {myServer} from './axios';

export const myGetAllTeams = async () => {
    try {
        const response = await myServer.get("/teams");
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const getAllPlayers = async () => {
    try {
        const response = await myServer.get("/players")
        return response.data
    } catch (e) {
        console.error(e)
    }
}


export const getPlayerOrTeamStats = async (playerId: number, teamId: number, statCategory: string, quarter: number) => {
    const GENERAL_STATS = ["avgMinutes", "avgRebounds", "avgPoints", "avgAssists", "trueShootingPct"]
    const OFFENCE_STATS = ["avgPoints", "avgAssists", "trueShootingPct", "avgOffensiveRebounds", "usageRate"]
    const DEFENSE_STATS = ["avgBlocks", "avgSteals", "avgDefensiveRebounds"]


    try {
        const response = await myServer.get("/players", {
            params: {
                playerId: playerId,
                teamId: teamId,
                statCategory: statCategory.toLowerCase() === "defensive" ? "def" : "",
                quarter: !quarter ? "" : quarter
            }
        })

        console.log(response.data)
        return response.data;
        // const data = [...response.data.categories[2].stats, ...response.data.categories[1].stats, ...response.data.categories[0].stats]
        // return data
        //     .filter((field: any) => selectedCat.includes(field.name))
    } catch (error) {
        console.error(error)
    }
}