import axios from "axios"

// RAPID API NBA CLIENT

export const rapidNbaClient = axios.create({
    baseURL: 'https://api-basketball-nba.p.rapidapi.com/',
    timeout: 10000,
    headers:
        {
            'x-rapidapi-key': process.env.REACT_APP_RAPID_API_KEY,
            'x-rapidapi-host': 'api-basketball-nba.p.rapidapi.com'
        }
})

export const myServer = axios.create({
    baseURL: 'http://localhost:3030/',
    timeout: 10000
})

export const nbaApiClient = axios.create({
    baseURL: 'http://localhost:5000/',
    timeout: 10000
})