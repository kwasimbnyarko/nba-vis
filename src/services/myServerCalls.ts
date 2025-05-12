/**
 * Basic api calls
 */

import {nbaApiClient} from './axios';
import {DISPLAY_NAME_N_DESC} from "../utils/constants";

export const myGetAllTeams = async () => {
    try {
        const response = await nbaApiClient.get("/teams");
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const getAllPlayers = async () => {
    try {
        const response = await nbaApiClient.get("/player")
        return response.data
    } catch (e) {
        console.error(e)
    }
}

export const getPlayerOrTeamStats = async (
    playerId: number,
    teamId: number,
    statCategory: string,
    gameSituation: string,
    quarter: number
) => {
    const GENERAL_STATS = ["PTS", "AST", "REB", "FTM", "FG_PCT"]
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

    try {
        const response = await nbaApiClient.get
        (`/${teamId === 0 ? "players" : "team"}/${gameSituation === "Clutch" ? "clutch" : "stats"}`, {
            params: (teamId === 0) ?
                {
                    player_id: playerId,
                    // season: season,
                    defense: statCategory.toLowerCase() === "defensive" ? "def" : "",
                    quarter: !quarter ? "" : quarter
                } :
                {
                    team_id: teamId,
                    // season: season,
                    defense: statCategory.toLowerCase() === "defensive" ? "def" : "",
                    quarter: !quarter ? "" : quarter
                }
        })

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