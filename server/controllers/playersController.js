import {
    dataDirectoryPath,
    getFriendlierJson
} from "../helpers/dataRestructurer.js";
import path from "path";
import {readFile} from "fs/promises";

export const getPlayers = async (req, res) => {
    const filePath = path.join(dataDirectoryPath, "allPlayers.json")
    const readData = await readFile(filePath, 'utf8')
    const jsonData = JSON.parse(readData)
    const rowSet = getFriendlierJson(jsonData)

    var result = rowSet

    if (req.query.playerId) {
        result = rowSet.find(player => player.PLAYER_ID === parseInt(req.query.playerId))
        console.log(result)
    }

    if (req.query.teamId) {
        result = rowSet.filter(player => player.TEAM_ID === parseInt(req.query.teamId))
        console.log(result)
    }

    res.json(result);
};