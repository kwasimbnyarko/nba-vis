export const GAME_SITUATIONS = ["Quarters", "Clutch"]
export const QUARTERS = ["All", "Q1", "Q2", "Q3", "Q4"]
export const STAT_CATEGORIES = ["General", "Offensive", "Defensive"]

export const PLAYER_GRAPH_COLORS = [
    '#e6194b', // red
    '#3cb44b', // green
    '#ffe119', // yellow
    '#4363d8', // blue
    '#f58231', // orange
    '#911eb4', // purple
    '#46f0f0', // cyan
    '#f032e6', // magenta
    '#bcf60c', // lime
    '#fabebe', // pink
    '#008080', // teal
    '#e6beff', // lavender
    '#9a6324', // brown
    '#fffac8', // light yellow
    '#800000', // maroon
    '#aaffc3', // mint
    '#808000', // olive
    '#ffd8b1', // peach
    '#000075', // navy
    '#808080'  // gray
];

const coolColors = [
    '#00bcd4', // cyan
    '#03a9f4', // light blue
    '#2196f3', // blue
    '#3f51b5', // indigo
    '#673ab7', // deep purple
    '#9c27b0', // purple
    '#e91e63', // pink
    '#f06292', // light pink
    '#4db6ac', // teal
    '#81c784', // light green
    '#aed581', // lime green
    '#ffd54f', // amber
    '#ffb74d', // orange
    '#ff8a65', // coral
    '#90a4ae'  // blue gray
];


export const DISPLAY_NAMES = {
    "PTS": "Points",
    "AST": "Assists",
    "REB": "Rebounds",
    "PLUS_MINUS": "Plus/Minus",
    "FG_PCT": "Field Foal Percentage",
    "OREB": "Offensive Rebounds",
    "DREB": "Defensive Rebounds",
    "FG3_PCT": "3-Pt Field Goal Percentage",
    "BLK": "Blocks",
    "STL": "Steals",
    "PLAYER_NAME": "Player Name"
}

export const DISPLAY_NAME_N_DESC = {
    PTS: {
        fullname: "Points",
        desc: "Total number of points scored by the player in the game."
    },
    AST: {
        fullname: "Assists",
        desc: "Number of times the player helped a teammate score."
    },
    REB: {
        fullname: "Rebounds",
        desc: "Total rebounds including both offensive and defensive."
    },
    PLUS_MINUS: {
        fullname: "Plus/Minus",
        desc: "The point differential when the player is on the court."
    },
    FG_PCT: {
        fullname: "Field Goal Percentage",
        desc: "Percentage of successful field goals made by the player."
    },
    FT_PCT: {
        fullname: "Free Throw %",
        desc: "Percentage of successful free throws made by the player"
    },
    OREB: {
        fullname: "Offensive Rebounds",
        desc: "Number of times the player retrieved the ball after a missed shot by their team."
    },
    DREB: {
        fullname: "Defensive Rebounds",
        desc: "Number of times the player retrieved the ball after a missed shot by the opposing team."
    },
    FG3_PCT: {
        fullname: "3-Pt Field Goal Percentage",
        desc: "Percentage of successful three-point shots made by the player."
    },
    BLK: {
        fullname: "Blocks",
        desc: "Number of times the player blocked an opponent's shot."
    },
    STL: {
        fullname: "Steals",
        desc: "Number of times the player took the ball away from an opponent."
    },
    PLAYER_NAME: {
        fullname: "Player Name",
        desc: "The full name of the player."
    },
    FTM: {
        fullname: "Free Throws Made",
        desc: "The number of free throw made per game"
    }
};
