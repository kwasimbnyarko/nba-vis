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
                // season:2025
            }
        })

        const data = [...response.data.categories[2].stats, ...response.data.categories[1].stats, ...response.data.categories[0].stats]
        // console.log(response.data)
        // console.log(data
        //     .filter((field: any) => selectedCat.includes(field.name)))
        return data
            .filter((field: any) => selectedCat.includes(field.name))
    } catch (error) {
        console.error(error)
    }
}

// [
//     {
//         "name": "assists",
//         "displayName": "Assists",
//         "shortDisplayName": "AST",
//         "description": "The number of times a player who passes the ball to a teammate in a way that leads to a score by field goal, meaning that he or she was \"assisting\" in the basket. There is some judgment involved in deciding whether a passer should be credited with an assist.",
//         "abbreviation": "AST",
//         "value": 6540,
//         "displayValue": "6540"
//     },
//     {
//         "name": "effectiveFGPct",
//         "displayName": "Effective Field Goal Percentage",
//         "shortDisplayName": "EFF FG%",
//         "description": "Metric that gives 3pt field goals more worth than 2pt field goals: (FGM + (0.5 x 3PTM)) / FGA",
//         "abbreviation": "EFF FG%",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "fieldGoals",
//         "displayName": "Field Goals",
//         "shortDisplayName": "FG",
//         "description": "Field Goal makes and attempts.",
//         "abbreviation": "FG",
//         "value": 0.471127,
//         "displayValue": "8648/18356"
//     },
//     {
//         "name": "fieldGoalsAttempted",
//         "displayName": "Field Goals Attempted",
//         "shortDisplayName": "FGA",
//         "description": "The number of times a 2pt field goal was attempted.",
//         "abbreviation": "FGA",
//         "value": 18356,
//         "displayValue": "18356"
//     },
//     {
//         "name": "fieldGoalsMade",
//         "displayName": "Field Goals Made",
//         "shortDisplayName": "FGM",
//         "description": "The number of times a 2pt field goal was made.",
//         "abbreviation": "FGM",
//         "value": 8648,
//         "displayValue": "8648"
//     },
//     {
//         "name": "fieldGoalPct",
//         "displayName": "Field Goal Percentage",
//         "shortDisplayName": "FG%",
//         "description": "The ratio of field goals made to field goals attempted: FGM / FGA",
//         "abbreviation": "FG%",
//         "value": 47.112998962402344,
//         "displayValue": "47.1"
//     },
//     {
//         "name": "freeThrows",
//         "displayName": "Free Throws",
//         "shortDisplayName": "FT",
//         "description": "Free Throw makes and attempts.",
//         "abbreviation": "FT",
//         "value": 0.911392,
//         "displayValue": "4032/4424"
//     },
//     {
//         "name": "freeThrowPct",
//         "displayName": "Free Throw Percentage",
//         "shortDisplayName": "FT%",
//         "description": "The ratio of free throws made to free throws attempted: FTM / FTA",
//         "abbreviation": "FT%",
//         "value": 91.13899993896484,
//         "displayValue": "91.1"
//     },
//     {
//         "name": "freeThrowsAttempted",
//         "displayName": "Free Throws Attempted",
//         "shortDisplayName": "FTA",
//         "description": "The number of times a free throw was attempted.",
//         "abbreviation": "FTA",
//         "value": 4424,
//         "displayValue": "4424"
//     },
//     {
//         "name": "freeThrowsMade",
//         "displayName": "Free Throws Made",
//         "shortDisplayName": "FTM",
//         "description": "The number of times a free throw was made.",
//         "abbreviation": "FTM",
//         "value": 4032,
//         "displayValue": "4032"
//     },
//     {
//         "name": "offensiveRebounds",
//         "displayName": "Offensive Rebounds",
//         "shortDisplayName": "OREB",
//         "description": "The number of times when the offense obtains the possession of the ball after a missed shot.",
//         "abbreviation": "OR",
//         "value": 669,
//         "displayValue": "669"
//     },
//     {
//         "name": "points",
//         "displayName": "Points",
//         "shortDisplayName": "PTS",
//         "description": "The number of points scored.",
//         "abbreviation": "PTS",
//         "value": 25386,
//         "displayValue": "25386"
//     },
//     {
//         "name": "turnovers",
//         "displayName": "Turnovers",
//         "shortDisplayName": "TO",
//         "description": "The number of times a player loses possession to the other team.",
//         "abbreviation": "TO",
//         "value": 3187,
//         "displayValue": "3187"
//     },
//     {
//         "name": "threePointPct",
//         "displayName": "3-Point Field Goal Percentage",
//         "shortDisplayName": "3P%",
//         "description": "The ratio of 3pt field goals made to 3pt field goals attempted: 3PM / 3PA.",
//         "abbreviation": "3P%",
//         "value": 42.319000244140625,
//         "displayValue": "42.3"
//     },
//     {
//         "name": "threePointFieldGoalsAttempted",
//         "displayName": "3-Point Field Goals Attempted",
//         "shortDisplayName": "3PA",
//         "description": "The number of times a 3pt field goal was attempted.",
//         "abbreviation": "3PA",
//         "value": 9589,
//         "displayValue": "9589"
//     },
//     {
//         "name": "threePointFieldGoalsMade",
//         "displayName": "3-Point Field Goals Made",
//         "shortDisplayName": "3PM",
//         "description": "The number of times a 3pt field goal was made.",
//         "abbreviation": "3PM",
//         "value": 4058,
//         "displayValue": "4058"
//     },
//     {
//         "name": "trueShootingPct",
//         "displayName": "True Shooting Percentage",
//         "shortDisplayName": "TS%",
//         "description": "What a team's shooting percentage would be if we accounted for free throws and 3-pointers. True Shooting Percentage = (Total points x 50) divided by [(FGA + (FTA x 0.44)].",
//         "abbreviation": "TS%",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "teamTurnovers",
//         "displayName": "Team Turnovers",
//         "shortDisplayName": "TTO",
//         "description": "The number of turnovers for the team.",
//         "abbreviation": "TTO",
//         "value": 0,
//         "displayValue": "0"
//     },
//     {
//         "name": "totalTurnovers",
//         "displayName": "Total Turnovers",
//         "shortDisplayName": "ToTO",
//         "description": "The number of turnovers plus team turnovers for the team.",
//         "abbreviation": "ToTO",
//         "value": 3187,
//         "displayValue": "3187"
//     },
//     {
//         "name": "assistRatio",
//         "displayName": "Assist Ratio",
//         "shortDisplayName": "AST",
//         "description": "The percentage of a team's possessions that ends in an assist. Assist Ratio = (Assists x 100) divided by [(FGA + (FTA x 0.44) + Assists + Turnovers].",
//         "abbreviation": "AST",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "pointsInPaint",
//         "displayName": "Points in the Paint",
//         "shortDisplayName": "PIP",
//         "description": "The amount of points scored in the area known as \"the Paint\"(the rectangle between the foul line and the baseline).",
//         "abbreviation": "PIP",
//         "value": 0,
//         "displayValue": "0"
//     },
//     {
//         "name": "offReboundRate",
//         "displayName": "Offensive Rebound Rate",
//         "shortDisplayName": "ORR",
//         "description": "The percentage of missed shots that a team rebounds offensively. Offensive Rebound Rate = (Offensive Rebounds x Team Minutes) divided by [Player Minutes x (Team Offensive Rebounds + Opponent Defensive Rebounds)].",
//         "abbreviation": "ORR",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "turnoverRatio",
//         "displayName": "Turnover Ratio",
//         "shortDisplayName": "TO",
//         "description": "The percentage of a team's possessions that end in a turnover. Turnover Ratio = (Turnover x 100) divided by [(FGA + (FTA x 0.44) + Assists + Turnovers].",
//         "abbreviation": "TO",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "brickIndex",
//         "displayName": "Brick Index",
//         "shortDisplayName": "BI",
//         "description": "How many points a player costs his team with his shooting compared with the league average on a per-40-minute basis. ((52.8 - TS%) x (FGA + (FTA x 0.44))) / (Min/40) .",
//         "abbreviation": "BI",
//         "value": 0,
//         "displayValue": "0.00"
//     },
//     {
//         "name": "usageRate",
//         "displayName": "Usage Rate",
//         "shortDisplayName": "USG",
//         "description": "the number of possessions a player uses per 40 minutes. Usage Rate = {[FGA + (FT Att. x 0.44) + (Ast x 0.33) + TO] x 40 x League Pace} divided by (Minutes x Team Pace)",
//         "abbreviation": "USG",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "fastBreakPoints",
//         "displayName": "Fast Break Points",
//         "shortDisplayName": "FBPs",
//         "description": "The number of points scored on fast breaks.",
//         "abbreviation": "FBPs",
//         "value": 0,
//         "displayValue": "0"
//     },
//     {
//         "name": "possessions",
//         "displayName": "Possessions",
//         "shortDisplayName": "POSS",
//         "description": "The total number of possessions for a team or player.",
//         "abbreviation": "POSS",
//         "value": 0,
//         "displayValue": "0"
//     },
//     {
//         "name": "paceFactor",
//         "displayName": "Pace Factor",
//         "shortDisplayName": "PACE",
//         "description": "The number of possessions a team uses per game.",
//         "abbreviation": "PACE",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "avgFieldGoalsMade",
//         "displayName": "Average Field Goals Made",
//         "shortDisplayName": "AFGM",
//         "description": "The average field goals made per game.",
//         "abbreviation": "FGM",
//         "value": 8.42885,
//         "displayValue": "8.4"
//     },
//     {
//         "name": "avgFieldGoalsAttempted",
//         "displayName": "Average Field Goals Attempted",
//         "shortDisplayName": "AFGA",
//         "description": "The average field goals attempted per game.",
//         "abbreviation": "FGA",
//         "value": 17.890839,
//         "displayValue": "17.9"
//     },
//     {
//         "name": "avgThreePointFieldGoalsMade",
//         "displayName": "Average 3-Point Field Goals Made",
//         "shortDisplayName": "A3PM",
//         "description": "The average three point field goals made per game.",
//         "abbreviation": "3PM",
//         "value": 3.9551656,
//         "displayValue": "4.0"
//     },
//     {
//         "name": "avgThreePointFieldGoalsAttempted",
//         "displayName": "Average 3-Point Field Goals Attempted",
//         "shortDisplayName": "A3PA",
//         "description": "The average three point field goals attempted per game.",
//         "abbreviation": "3PA",
//         "value": 9.346004,
//         "displayValue": "9.3"
//     },
//     {
//         "name": "avgFreeThrowsMade",
//         "displayName": "Average Free Throws Made",
//         "shortDisplayName": "AFTM",
//         "description": "The average free throw shots made per game.",
//         "abbreviation": "FTM",
//         "value": 3.9298246,
//         "displayValue": "3.9"
//     },
//     {
//         "name": "avgFreeThrowsAttempted",
//         "displayName": "Average Free Throws Attempted",
//         "shortDisplayName": "AFTA",
//         "description": "The average free throw shots attempted per game.",
//         "abbreviation": "FTA",
//         "value": 4.3118906,
//         "displayValue": "4.3"
//     },
//     {
//         "name": "avgPoints",
//         "displayName": "Points Per Game",
//         "shortDisplayName": "PPG",
//         "description": "The average number of points scored per game.",
//         "abbreviation": "PTS",
//         "value": 24.74269,
//         "displayValue": "24.7"
//     },
//     {
//         "name": "avgOffensiveRebounds",
//         "displayName": "Offensive Rebounds Per Game",
//         "shortDisplayName": "ORPG",
//         "description": "The average offensive rebounds per game.",
//         "abbreviation": "OR",
//         "value": 0.6520468,
//         "displayValue": "0.7"
//     },
//     {
//         "name": "avgAssists",
//         "displayName": "Assists Per Game",
//         "shortDisplayName": "APG",
//         "description": "The average assists per game.",
//         "abbreviation": "AST",
//         "value": 6.374269,
//         "displayValue": "6.4"
//     },
//     {
//         "name": "avgTurnovers",
//         "displayName": "Turnovers Per Game",
//         "shortDisplayName": "TOPG",
//         "description": "The average turnovers committed per game.",
//         "abbreviation": "TO",
//         "value": 3.106238,
//         "displayValue": "3.1"
//     },
//     {
//         "name": "offensiveReboundPct",
//         "displayName": "Offensive Rebound Percentage",
//         "shortDisplayName": "OR%",
//         "description": "The percentage of the number of times they obtain the possession of the ball after a missed shot.",
//         "abbreviation": "OR%",
//         "value": 0.06891224,
//         "displayValue": "0.1"
//     },
//     {
//         "name": "estimatedPossessions",
//         "displayName": "Estimated Possessions",
//         "shortDisplayName": "EP",
//         "description": "An estimation of the number of possessions for a team or player.",
//         "abbreviation": "EP",
//         "value": 22643.6,
//         "displayValue": "22643.6"
//     },
//     {
//         "name": "avgEstimatedPossessions",
//         "displayName": "Estimated Possessions Per Game",
//         "shortDisplayName": "AEP",
//         "description": "The average number of estimated possessions per game for a team or player.",
//         "abbreviation": "EP",
//         "value": 22.069786,
//         "displayValue": "22.1"
//     },
//     {
//         "name": "pointsPerEstimatedPossessions",
//         "displayName": "Points Per Estimated Possession",
//         "shortDisplayName": "PPEP",
//         "description": "The number of points per estimated possession for a team or player",
//         "abbreviation": "PPEP",
//         "value": 1.1211115,
//         "displayValue": "1.1"
//     },
//     {
//         "name": "avgTeamTurnovers",
//         "displayName": "Team Turnovers Per Game",
//         "shortDisplayName": "ATTO",
//         "description": "The average number of turnovers for a team per game.",
//         "abbreviation": "TTO",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "avgTotalTurnovers",
//         "displayName": "Total Turnovers Per Game",
//         "shortDisplayName": "AToTO",
//         "description": "The average number of total turnovers for a team per game.",
//         "abbreviation": "ToTO",
//         "value": 3.1062378883361816,
//         "displayValue": "3.1"
//     },
//     {
//         "name": "threePointFieldGoalPct",
//         "displayName": "3-Point Field Goal Percentage",
//         "shortDisplayName": "3P%",
//         "description": "The ratio of 3pt field goals made to 3pt field goals attempted: 3PM / 3PA.",
//         "abbreviation": "3P%",
//         "value": 42.31932461261749,
//         "displayValue": "42.3"
//     },
//     {
//         "name": "twoPointFieldGoalsMade",
//         "displayName": "2-Point Field Goals Made",
//         "shortDisplayName": "2PM",
//         "description": "The number of 2-point field goals made for a team or player.",
//         "abbreviation": "2PM",
//         "value": 4590,
//         "displayValue": "4590.0"
//     },
//     {
//         "name": "twoPointFieldGoalsAttempted",
//         "displayName": "2-Point Field Goals Attempted",
//         "shortDisplayName": "2PA",
//         "description": "The number of 2-point field goals attempted for a team or player.",
//         "abbreviation": "2PA",
//         "value": 8767,
//         "displayValue": "8767.0"
//     },
//     {
//         "name": "avgTwoPointFieldGoalsMade",
//         "displayName": "2-Point Field Goals Made per Game",
//         "shortDisplayName": "2PM",
//         "description": "The number of 2-point field goals made per game for a team or player.",
//         "abbreviation": "2PM",
//         "value": 4.4736843,
//         "displayValue": "4.5"
//     },
//     {
//         "name": "avgTwoPointFieldGoalsAttempted",
//         "displayName": "2-Point Field Goals Attempted per Game",
//         "shortDisplayName": "2PA",
//         "description": "The number of 2-point field goals attempted per game for a team or player.",
//         "abbreviation": "2PA",
//         "value": 8.544834,
//         "displayValue": "8.5"
//     },
//     {
//         "name": "twoPointFieldGoalPct",
//         "displayName": "2-Point Field Goal Percentage",
//         "shortDisplayName": "2P%",
//         "description": "The percentage of 2-points fields goals made by a team or player.",
//         "abbreviation": "2P%",
//         "value": 52.3554265499115,
//         "displayValue": "52.4"
//     },
//     {
//         "name": "shootingEfficiency",
//         "displayName": "Shooting Efficiency",
//         "shortDisplayName": "SH-EFF",
//         "description": "The efficiency with which a team or player shoots the basketball.",
//         "abbreviation": "SH-EFF",
//         "value": 0.58166265,
//         "displayValue": "0.58"
//     },
//     {
//         "name": "scoringEfficiency",
//         "displayName": "Scoring Efficiency",
//         "shortDisplayName": "SC-EFF",
//         "description": "The efficiency with which a team or player scores the basketball.",
//         "abbreviation": "SC-EFF",
//         "value": 1.3829811,
//         "displayValue": "1.383"
//     },
//     {
//         "name": "avg48FieldGoalsMade",
//         "displayName": "Fieldgoals Made Per 48",
//         "shortDisplayName": "FGM/48",
//         "description": "The average number of fieldgoals made per 48 minutes.",
//         "abbreviation": "FGM/48",
//         "value": 11.867913,
//         "displayValue": "11.9"
//     },
//     {
//         "name": "avg48FieldGoalsAttempted",
//         "displayName": "Fieldgoals Attempted Per 48",
//         "shortDisplayName": "FGA/48",
//         "description": "The average number of fieldgoals attempted per 48 minutes.",
//         "abbreviation": "FGA/48",
//         "value": 25.190498,
//         "displayValue": "25.2"
//     },
//     {
//         "name": "avg48ThreePointFieldGoalsMade",
//         "displayName": "3-Point Fieldgoals Made Per 48",
//         "shortDisplayName": "3PM/48",
//         "description": "The average per number of 3-Pointers made per 48 minutes.",
//         "abbreviation": "3PM/48",
//         "value": 5.568917,
//         "displayValue": "5.6"
//     },
//     {
//         "name": "avg48ThreePointFieldGoalsAttempted",
//         "displayName": "3-Point Fieldgoals Attempted Per 48",
//         "shortDisplayName": "3PA/48",
//         "description": "The average number of 3-pointers attempted per 48 minutes.",
//         "abbreviation": "3PA/48",
//         "value": 13.159277,
//         "displayValue": "13.2"
//     },
//     {
//         "name": "avg48FreeThrowsMade",
//         "displayName": "Freethrows Made Per 48",
//         "shortDisplayName": "FTM/48",
//         "description": "The average number of Free Throws made per 48 minutes.",
//         "abbreviation": "FTM/48",
//         "value": 5.5332365,
//         "displayValue": "5.5"
//     },
//     {
//         "name": "avg48FreeThrowsAttempted",
//         "displayName": "Freethrows Attempted Per 48",
//         "shortDisplayName": "FTA/48",
//         "description": "The average number of free throws attempted per 48 minutes.",
//         "abbreviation": "FTA/48",
//         "value": 6.0711894,
//         "displayValue": "6.1"
//     },
//     {
//         "name": "avg48Points",
//         "displayName": "Points Scored Per 48",
//         "shortDisplayName": "PTS/48",
//         "description": "The average number of points scored per 48 minutes.",
//         "abbreviation": "PTS",
//         "value": 34.83798,
//         "displayValue": "34.8"
//     },
//     {
//         "name": "avg48OffensiveRebounds",
//         "displayName": "Offensive Rebounds Per 48",
//         "shortDisplayName": "OREB/48",
//         "description": "The average number of offenseive rebounds per 48 minutes.",
//         "abbreviation": "OR",
//         "value": 0.91808903,
//         "displayValue": "0.9"
//     },
//     {
//         "name": "avg48Assists",
//         "displayName": "Assists Per 48",
//         "shortDisplayName": "AST/48",
//         "description": "The average number of assists per 48 minutes.",
//         "abbreviation": "AST",
//         "value": 8.97504,
//         "displayValue": "9.0"
//     },
//     {
//         "name": "avg48Turnovers",
//         "displayName": "Turnovers",
//         "shortDisplayName": "TO/48",
//         "description": "The average number of turnovers per 48 minutes.",
//         "abbreviation": "TO",
//         "value": 4.3736167,
//         "displayValue": "4.4"
//     },
//     {
//         "name": "p40",
//         "displayName": "P/40",
//         "shortDisplayName": "P/40",
//         "description": "Points Per 40 Minutes.",
//         "abbreviation": "P/40",
//         "value": 29.03164936958573,
//         "displayValue": "29.0"
//     },
//     {
//         "name": "a40",
//         "displayName": "A/40",
//         "shortDisplayName": "A/40",
//         "description": "Assists Per 40 Minutes.",
//         "abbreviation": "A/40",
//         "value": 7.479200617548675,
//         "displayValue": "7.5"
//     },
//     {
//         "name": "disqualifications",
//         "displayName": "Disqualifications",
//         "shortDisplayName": "DQ",
//         "description": "The number of times a player reached the foul limit.",
//         "abbreviation": "DQ",
//         "value": 11,
//         "displayValue": "11"
//     },
//     {
//         "name": "flagrantFouls",
//         "displayName": "Flagrant Fouls",
//         "shortDisplayName": "FLAG",
//         "description": "The number of fouls that the officials thought were unnecessary or excessive.",
//         "abbreviation": "FLAG",
//         "value": 0,
//         "displayValue": "0"
//     },
//     {
//         "name": "fouls",
//         "displayName": "Fouls",
//         "shortDisplayName": "PF",
//         "description": "The number of times a player had illegal contact with the opponent.",
//         "abbreviation": "PF",
//         "value": 2310,
//         "displayValue": "2310"
//     },
//     {
//         "name": "PER",
//         "displayName": "Player Efficiency Rating",
//         "shortDisplayName": "PER",
//         "description": "A numerical value for each of a player's accomplishments per-minute and is pace-adjusted for the team they play on. The league average in PER to 15.00 every season.",
//         "abbreviation": "PER",
//         "value": 0,
//         "displayValue": "0.00"
//     },
//     {
//         "name": "reboundRate",
//         "displayName": "Rebound Rate",
//         "shortDisplayName": "REBR",
//         "description": "The percentage of missed shots that a team rebounds. Rebound Rate = (Rebounds x Team Minutes) divided by [Player Minutes x (Team Rebounds + Opponent Rebounds)]",
//         "abbreviation": "REBR",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "ejections",
//         "displayName": "Ejections",
//         "shortDisplayName": "EJECT",
//         "description": "The number of times a player or coach is removed from the game as a result of a serious offense.",
//         "abbreviation": "EJECT",
//         "value": 2,
//         "displayValue": "2"
//     },
//     {
//         "name": "technicalFouls",
//         "displayName": "Technical Fouls",
//         "shortDisplayName": "TECH",
//         "description": "The number of times an player or coach was called for a technical foul (unsportsmanlike conduct or violations).",
//         "abbreviation": "TECH",
//         "value": 28,
//         "displayValue": "28"
//     },
//     {
//         "name": "rebounds",
//         "displayName": "Rebounds",
//         "shortDisplayName": "REB",
//         "description": "The total number of rebounds (offensive and defensive).",
//         "abbreviation": "REB",
//         "value": 4819,
//         "displayValue": "4819"
//     },
//     {
//         "name": "VORP",
//         "displayName": "Value Over Replacement Player",
//         "shortDisplayName": "VORP",
//         "description": "Value Over Replacement Player.",
//         "abbreviation": "VORP",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "minutes",
//         "displayName": "Minutes",
//         "shortDisplayName": "MIN",
//         "description": "The total number of minutes played.",
//         "abbreviation": "MIN",
//         "value": 34977,
//         "displayValue": "34977"
//     },
//     {
//         "name": "avgMinutes",
//         "displayName": "Minutes Per Game",
//         "shortDisplayName": "MPG",
//         "description": "The average number of minutes per game.",
//         "abbreviation": "MIN",
//         "value": 34.090645,
//         "displayValue": "34.1"
//     },
//     {
//         "name": "fantasyRating",
//         "displayName": "Fantasy Rating",
//         "shortDisplayName": "FANT",
//         "description": "The Fantasy Rating of a player.",
//         "abbreviation": "FANT",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "NBARating",
//         "displayName": "Rating",
//         "shortDisplayName": "Rating",
//         "description": "Custom formula to rate the performance of a player based on points, assists, steals, blocks, turnovers, rebounds, three pointers, and free throws",
//         "abbreviation": "RTG",
//         "value": 41.5771,
//         "displayValue": "41.6"
//     },
//     {
//         "name": "avgRebounds",
//         "displayName": "Rebounds Per Game",
//         "shortDisplayName": "RPG",
//         "description": "The average rebounds per game.",
//         "abbreviation": "REB",
//         "value": 4.6968813,
//         "displayValue": "4.7"
//     },
//     {
//         "name": "avgFouls",
//         "displayName": "Fouls Per Game",
//         "shortDisplayName": "PFPG",
//         "description": "The average fouls committed per game.",
//         "abbreviation": "PF",
//         "value": 2.251462,
//         "displayValue": "2.3"
//     },
//     {
//         "name": "avgFlagrantFouls",
//         "displayName": "Flagrant Fouls Per Game",
//         "shortDisplayName": "FLAGPG",
//         "description": "The average number of flagrant fouls per game.",
//         "abbreviation": "FLAGPG",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "avgTechnicalFouls",
//         "displayName": "Technical Fouls Per Game",
//         "shortDisplayName": "TECHPG",
//         "description": "The average number of technical fouls per game.",
//         "abbreviation": "TECHPG",
//         "value": 0.027290449,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "avgEjections",
//         "displayName": "Ejections Per Game",
//         "shortDisplayName": "EJCTPG",
//         "description": "The average ejections per game.",
//         "abbreviation": "EJCTPG",
//         "value": 0.0019493178,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "avgDisqualifications",
//         "displayName": "Disqualifications Per Game",
//         "shortDisplayName": "DQPG",
//         "description": "The average number of disqualifications per game.",
//         "abbreviation": "DQPG",
//         "value": 0.010721248,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "assistTurnoverRatio",
//         "displayName": "Assist To Turnover Ratio",
//         "shortDisplayName": "AST/TO",
//         "description": "The average number of assists a player or team records per turnover",
//         "abbreviation": "AST/TO",
//         "value": 2.0520866,
//         "displayValue": "2.1"
//     },
//     {
//         "name": "stealFoulRatio",
//         "displayName": "Steal To Foul Ratio",
//         "shortDisplayName": "STL/PF",
//         "description": "The average number of steals a player or team records per foul committed.",
//         "abbreviation": "STL/PF",
//         "value": 0.67186147,
//         "displayValue": "0.7"
//     },
//     {
//         "name": "blockFoulRatio",
//         "displayName": "Block To Foul Ratio",
//         "shortDisplayName": "BLK/PF",
//         "description": "The average number of blocks a player or record per foul committed.",
//         "abbreviation": "BLK/PF",
//         "value": 0.114718616,
//         "displayValue": "0.1"
//     },
//     {
//         "name": "avgTeamRebounds",
//         "displayName": "Team Rebounds Per Game",
//         "shortDisplayName": "TREBPG",
//         "description": "The average number of rebounds for a team per game.",
//         "abbreviation": "TREBPG",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "totalRebounds",
//         "displayName": "Rebounds",
//         "shortDisplayName": "REB",
//         "description": "The total number of rebounds for a team or player",
//         "abbreviation": "REB",
//         "value": 4819,
//         "displayValue": "4819"
//     },
//     {
//         "name": "totalTechnicalFouls",
//         "displayName": "Total Technical Fouls",
//         "shortDisplayName": "TECH",
//         "description": "The total number of technical fouls for a team or player",
//         "abbreviation": "TECH",
//         "value": 28,
//         "displayValue": "28"
//     },
//     {
//         "name": "teamAssistTurnoverRatio",
//         "displayName": "Assist To Turnover Ratio",
//         "shortDisplayName": "AST/TO",
//         "description": "The number of assists per turnover for a team",
//         "abbreviation": "AST/TO",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "teamRebounds",
//         "displayName": "Team Rebounds",
//         "shortDisplayName": "TREB",
//         "description": "The total number of rebounds for a team",
//         "abbreviation": "TREB",
//         "value": 0,
//         "displayValue": "0"
//     },
//     {
//         "name": "stealTurnoverRatio",
//         "displayName": "Steal To Turnover Ratio",
//         "shortDisplayName": "STL/TO",
//         "description": "The number of steals per turnover",
//         "abbreviation": "STL/TO",
//         "value": 0.48697835,
//         "displayValue": "0.5"
//     },
//     {
//         "name": "avg48Rebounds",
//         "displayName": "Rebounds Per 48 Minutes",
//         "shortDisplayName": "REB/48",
//         "description": "The average number of rebounds per 48 minutes.",
//         "abbreviation": "REB",
//         "value": 6.6132603,
//         "displayValue": "6.6"
//     },
//     {
//         "name": "avg48Fouls",
//         "displayName": "Fouls Per 48 Minutes",
//         "shortDisplayName": "PF/48",
//         "description": "The average number of fouls committed per 48 minutes.",
//         "abbreviation": "PF",
//         "value": 3.170083,
//         "displayValue": "3.2"
//     },
//     {
//         "name": "avg48FlagrantFouls",
//         "displayName": "Flagrant Fouls Per 48 Minutes",
//         "shortDisplayName": "FLAG/48",
//         "description": "The average number of flagrant fouls committed per 48 minutes.",
//         "abbreviation": "FLAG/48",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "avg48TechnicalFouls",
//         "displayName": "Technical Fouls Per 48 Minutes",
//         "shortDisplayName": "TECH/48",
//         "description": "The average number of technical fouls committed per 48 minutes.",
//         "abbreviation": "TECH/48",
//         "value": 0.03842525,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "avg48Ejections",
//         "displayName": "Ejections Per 48 Minutes",
//         "shortDisplayName": "EJECT/48",
//         "description": "The average number of ejections per 48 minutes.",
//         "abbreviation": "EJECT/48",
//         "value": 0.0027446607,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "avg48Disqualifications",
//         "displayName": "Disqualifications Per 48 Minutes",
//         "shortDisplayName": "DQ/48",
//         "description": "The average number of disqualifications per 48 minutes.",
//         "abbreviation": "DQ/48",
//         "value": 0.015095634,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "r40",
//         "displayName": "R/40",
//         "shortDisplayName": "R/40",
//         "description": "Rebounds Per 40 Minutes.",
//         "abbreviation": "R/40",
//         "value": 5.511050118649398,
//         "displayValue": "5.5"
//     },
//     {
//         "name": "gamesPlayed",
//         "displayName": "Games Played",
//         "shortDisplayName": "GP",
//         "description": "Games Played",
//         "abbreviation": "GP",
//         "value": 1026,
//         "displayValue": "1026"
//     },
//     {
//         "name": "gamesStarted",
//         "displayName": "Games Started",
//         "shortDisplayName": "GS",
//         "description": "The number of games started by an athlete.",
//         "abbreviation": "GS",
//         "value": 1020,
//         "displayValue": "1020"
//     },
//     {
//         "name": "doubleDouble",
//         "displayName": "Double Double",
//         "shortDisplayName": "DBLDBL",
//         "description": "The number of times double digit values were accumulated in 2 of the following categories: points, rebounds, assists, steals, and blocked shots",
//         "abbreviation": "DD2",
//         "value": 167,
//         "displayValue": "167"
//     },
//     {
//         "name": "tripleDouble",
//         "displayName": "Triple Double",
//         "shortDisplayName": "TRIDBL",
//         "description": "The number of times double digit values were accumulated in 3 of the following categories: points, rebounds, assists, steals, and blocked shots",
//         "abbreviation": "TD3",
//         "value": 10,
//         "displayValue": "10"
//     },
//     {
//         "name": "blocks",
//         "displayName": "Blocks",
//         "shortDisplayName": "BLK",
//         "description": "Short for blocked shot, number of times when a defensive player legally deflects a field goal attempt from an offensive player.",
//         "abbreviation": "BLK",
//         "value": 265,
//         "displayValue": "265"
//     },
//     {
//         "name": "defensiveRebounds",
//         "displayName": "Defensive Rebounds",
//         "shortDisplayName": "DREB",
//         "description": "The number of times when the defense obtains the possession of the ball after a missed shot by the offense.",
//         "abbreviation": "DR",
//         "value": 4150,
//         "displayValue": "4150"
//     },
//     {
//         "name": "steals",
//         "displayName": "Steals",
//         "shortDisplayName": "STL",
//         "description": "The number of times a defensive player forced a turnover by intercepting or deflecting a pass or a dribble of an offensive player.",
//         "abbreviation": "STL",
//         "value": 1552,
//         "displayValue": "1552"
//     },
//     {
//         "name": "turnoverPoints",
//         "displayName": "Points Conceded Off Turnovers",
//         "shortDisplayName": "Points Conceded Off Turnovers",
//         "description": "The amount of points resulting from the possession following a turnover.",
//         "abbreviation": "Points Conceded Off Turnovers",
//         "value": 0,
//         "displayValue": "0"
//     },
//     {
//         "name": "defReboundRate",
//         "displayName": "Defensive Rebound Rate",
//         "shortDisplayName": "DRR",
//         "description": "The percentage of missed shots that a team rebounds defensively. Rebound Rate = (Defensive Rebounds x Team Minutes) divided by [Player Minutes x (Team Defensive Rebounds + Opponent Defensive Rebounds)].",
//         "abbreviation": "DRR",
//         "value": 0,
//         "displayValue": "0.0"
//     },
//     {
//         "name": "avgDefensiveRebounds",
//         "displayName": "Defensive Rebounds Per Game",
//         "shortDisplayName": "DRPG",
//         "description": "The average defensive rebounds per game.",
//         "abbreviation": "DR",
//         "value": 4.044834,
//         "displayValue": "4.0"
//     },
//     {
//         "name": "avgBlocks",
//         "displayName": "Blocks Per Game",
//         "shortDisplayName": "BPG",
//         "description": "The average blocks per game.",
//         "abbreviation": "BLK",
//         "value": 0.2582846,
//         "displayValue": "0.3"
//     },
//     {
//         "name": "avgSteals",
//         "displayName": "Steals Per Game",
//         "shortDisplayName": "SPG",
//         "description": "The average steals per game.",
//         "abbreviation": "STL",
//         "value": 1.5126705,
//         "displayValue": "1.5"
//     },
//     {
//         "name": "avg48DefensiveRebounds",
//         "displayName": "Defensive Rebounds Per 48",
//         "shortDisplayName": "DREB/48",
//         "description": "The average number of defensive rebounds per 48 minutes.",
//         "abbreviation": "DR",
//         "value": 5.6951714,
//         "displayValue": "5.7"
//     },
//     {
//         "name": "avg48Blocks",
//         "displayName": "Blocks Per 48",
//         "shortDisplayName": "BLK/48",
//         "description": "The average number of blocks per 48 minutes.",
//         "abbreviation": "BLK",
//         "value": 0.36366755,
//         "displayValue": "0.4"
//     },
//     {
//         "name": "avg48Steals",
//         "displayName": "Steals Per 48",
//         "shortDisplayName": "STL/48",
//         "description": "The average number of steals per 48 minutes.",
//         "abbreviation": "STL",
//         "value": 2.1298566,
//         "displayValue": "2.1"
//     }
// ]