import path from 'path';
import {fileURLToPath} from 'url';

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dataDirectoryPath = path.join(__dirname, '../data');

export const getFriendlierJson = (jsonData) =>
    jsonData.rowSet.map((item) => Object.fromEntries(
        new Map(
            item.map((value, index) => [jsonData.headers[index], value])
        ))
    )
