/**
 * Basic api calls
 */

import {rapidNbaClient} from './axios';

export const getAllTeams = async () => {
    try {
        const response = await rapidNbaClient.get("/team/id");
        return response.data
    } catch (error) {
        console.error(error);
    }
}

export const getPlayersPerTeam = async (teamId: number) => {
    try {
        const response = await rapidNbaClient.get("players/id", {
            params: {
                teamId: teamId
            }
        })
        return response.data.data || null
    } catch (error) {
        console.error(error)
    }
}

export const getPlayerOverview = async (playerId: number) => {
    try {
        const response = await rapidNbaClient.get("player/overview", {
            params: {
                playerId: playerId
            }
        })
        return response.data.player_overview
    } catch (error) {
        console.error(error)
    }
}

/**
 * Adds two numbers.
 * @param {number} playerId
 * @param {number} category The category of stats. Values are "perGame", "total" or "per48".
 * @returns {Object} The player's splits.
 */
export const getPlayerSplits = async (playerId: number, category: string) => {
    try {
        const response = await rapidNbaClient.get("player/splits", {
            params: {
                playerId: playerId,
                year: 2024,
                category: category
            }
        })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const getPlayerStatistics = async (playerId: number, statCategory: string) => {
    const GENERAL_STATS = ["avgMinutes", "avgRebounds", "avgPoints", "avgAssists", "trueShootingPct"]
    const OFFENCE_STATS = ["avgPoints", "avgAssists", "trueShootingPct", "avgOffensiveRebounds", "usageRate"]
    const DEFENSE_STATS = ["avgBlocks", "avgSteals", "avgDefensiveRebounds"]


    let selectedCat = GENERAL_STATS; //General as default
    if (statCategory.toLowerCase() === "offensive")
        selectedCat = OFFENCE_STATS
    if (statCategory.toLowerCase() === "defensive")
        selectedCat = DEFENSE_STATS

    try {
        const response = await rapidNbaClient.get("nba-player-statistics", {
            params: {
                playerId: playerId,
            }
        })

        const data = [...response.data.categories[2].stats, ...response.data.categories[1].stats, ...response.data.categories[0].stats]
        return data
            .filter((field: any) => selectedCat.includes(field.name))
    } catch (error) {
        console.error(error)
    }
}