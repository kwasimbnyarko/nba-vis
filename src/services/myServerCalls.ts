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