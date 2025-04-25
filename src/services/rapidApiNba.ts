/**
 * Basis api calls
 */

import {rapidNbaClient} from './axios';

export const getAllTeams = async () => {
    try {
        const response = await rapidNbaClient.get("/team/id");

        return response.data.data
    } catch (error) {
        console.error(error);
    }
}

export const getPlayersPerTeam = async (teamId:number) => {
    try {
        const response = await rapidNbaClient.get("players/id",{
            params:{
                teamId:teamId
            }
        })
        return response.data
    }catch(error){
        console.error(error)
    }
}

export const getPlayerOverview = async (playerId:number) => {
    try {
        const response = await rapidNbaClient.get("player/overview",{
            params:{
                playerId:playerId
            }
        })
        return response.data.player_overview
    }catch (error) {
        console.error(error)
    }
}

/**
 * Adds two numbers.
 * @param {number} playerId
 * @param {number} category The category of stats. Values are "perGame", "total" or "per48".
 * @returns {Object} The player's splits.
 */
export const getPlayerSplits = async (playerId:number,category:string) => {
    try {
        const response = await rapidNbaClient.get("player/splits",{
            params:{
                playerId:playerId,
                year:2024,
                category:category
            }
        })
        return response.data
    }catch (error) {
        console.error(error)
    }
}

export const getPlayerStatistics = async (playerId:number) => {
    try {
        const response = await rapidNbaClient.get("nba-player-statistics",{
            params:{
                playerId:playerId,
            }
        })
        return response.data
    }catch (error) {
        console.error(error)
    }
}