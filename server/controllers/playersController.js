import {
    dataDirectoryPath,
    getFriendlierJson
} from "../helpers/dataRestructurer.js";
import path from "path";
import {readFile} from "fs/promises";

export const getPlayers = async (req, res) => {
    const quarter = req.query.quarter
    const category = req.query.category
    const playerId = req.query.playerId
    const teamId = req.query.teamId

    const extraDir = `./${!!quarter ? "q" + quarter + "/" : ""}`
    const fileName
        = `players${!!quarter ? "Q" + quarter : ""}${category?.toLowerCase() === "def" ? "Def" : ""}.json`

    const filePath = path.join(dataDirectoryPath, extraDir + fileName)
    const readData = await readFile(filePath, 'utf8')
    const jsonData = JSON.parse(readData)
    const rowSet = getFriendlierJson(jsonData)

    var result = rowSet

    if (playerId) {
        result = rowSet.filter(player => player.PLAYER_ID === parseInt(playerId))
    } else if (teamId) {
        result = rowSet.filter(player => player.TEAM_ID === parseInt(teamId))
    }

    res.json(result);
};