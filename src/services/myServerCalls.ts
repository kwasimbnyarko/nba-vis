/**
 * Basic api calls
 */

import {myServer} from './axios';
import {DISPLAY_NAME_N_DESC} from "../utils/constants";

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
    const GENERAL_STATS = ["PTS", "AST", "REB", "PLUS_MINUS", "FG_PCT"]
    const OFFENCE_STATS = ["PTS", "AST", "OREB", "FT_PCT", "FG_PCT", "FG3_PCT"]
    const DEFENSE_STATS = ["BLK", "STL", "DREB"]

    let selectedCat: string[] = []
    switch (statCategory.toLowerCase()) {
        case "general":
            selectedCat = GENERAL_STATS
            break
        case "offensive":
            selectedCat = OFFENCE_STATS
            break
        case "defensive":
            selectedCat = DEFENSE_STATS
            break
        default:
            selectedCat = GENERAL_STATS
            break

    }

    console.log(`FETCHIBNG ${statCategory}`)


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
        return Object.entries(response.data[0])
            .filter(([key]) => selectedCat.includes(key))
            .map(([key, value]) => {
                return {

                    abbreviation: key,
                    value: value,
                    // @ts-ignore
                    displayName: DISPLAY_NAME_N_DESC[key].fullname,
                    // @ts-ignore
                    description: DISPLAY_NAME_N_DESC[key].desc
                }
            })

    } catch (error) {
        console.error(error)
    }
}