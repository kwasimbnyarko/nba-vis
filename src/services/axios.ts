import axios from "axios"

// RAPID API NBA CLIENT

export const rapidNbaClient = axios.create({
    baseURL: 'https://api-basketball-nba.p.rapidapi.com/',
    timeout: 10000,
    headers:
        {
            'x-rapidapi-key': '7df705bb7bmsh489ff2f2d034e17p154d36jsn14374f2eb023',
            'x-rapidapi-host': 'api-basketball-nba.p.rapidapi.com'
        }
})