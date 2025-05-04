import {dataDirectoryPath} from "../helpers/dataRestructurer.js";
import path from "path";
import {readFile} from "fs/promises";

export const getAllTeams = async (req, res) => {
    const filePath = path.join(dataDirectoryPath, "allTeams.json")
    const readData = await readFile(filePath, 'utf8')
    const jsonData = JSON.parse(readData)

    console.log(jsonData.rowSet[0])

    const rowSet =
        jsonData.rowSet.map((player) => Object.fromEntries(
            new Map(
                player.map((value, index) => [jsonData.headers[index], value])
            ))
        )

    // const newRowSet = Object.fromEntries(rowSet)

    res.json(rowSet);
};