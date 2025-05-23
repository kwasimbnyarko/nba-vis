import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import ToggleBar from "../components/ToggleBar";
import Typography from "@mui/material/Typography";
import FilterableTextField from "../components/SelectTextField";
import {
    GAME_SITUATIONS,
    PLAYER_GRAPH_COLORS,
    QUARTERS,
    STAT_CATEGORIES
} from "../utils/constants";
import StyleComp from "../components/StyleComp";
import {getAllPlayers, myGetAllTeams} from "../services/myServerCalls";
import { useNavigate } from "react-router-dom";

function RadarPage(){
    const navigate = useNavigate(); // Add this line

    //The negative implies "Comparing Players"
    const [comparingTeams, setComparingTeams] = useState<boolean>(false)

    const [players, setPlayers] = useState<any[]>([])
    const [teams, setTeams] = useState<any[]>([])

    const [gameSituation, setGameSituation] = useState<string>("")
    const [quarter, setQuarter] = useState<string>("All")
    const [statCategory, setStatCategory] = useState<string>("")


    const handleToggleChange = (value: any,variableName:string) => {
        switch(variableName){
            case "gameSituation":
                setGameSituation(value)
                break;
            case "quarter":
                setQuarter(value)
                break;
            case "statCategory":
                setStatCategory(value)
                break;
            case "addTeam":
                if (!teams.includes(value))
                setTeams([...teams, value])
                break;
            case "addNewPlayer":
                if(!players.includes(value))
                setPlayers([...players,value])
                break
            case "playerOrTeam":
                setComparingTeams(value.toLowerCase().includes("team"))
                break
            default:
                console.error("No variable selected")
                break;
        }
    };


    const { data: allTeams , isLoading: isLoadingTeams } = useQuery({
        queryKey: ["allTeams"],
        queryFn: () => myGetAllTeams(),
    });

    const {data: allPlayers, isLoading: isPlayersLoading} = useQuery({
        queryKey: ["allPlayers"],
        queryFn: () => getAllPlayers(),
    })

    return (
    <div>
        <div className="play-style-section" style={{padding:"5rem"}}>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "0.5rem 1rem",
                        fontSize: "1rem",
                        cursor: "pointer",
                        marginBottom: "1rem",
                    }}
                >
                    Back to Home
                </button>
            <h2 style={{textAlign:"center"}}>Play Style</h2>
            {/*CONTROLS*/}
            <div
            style={{display:"flex",justifyContent:"space-around"}}
            >
                {/*PLAYER SEARCH AND MODE SELECTION*/}
                <div>
                    <div className="player-team-selection-area"
                         style={{display: "flex", justifyContent: "space-around"}}>
                        <div>
                            {
                                comparingTeams ?
                                    <FilterableTextField fieldName={
                                        teams.length > 5 ?
                                            "Limit reached"
                                            : "Search and add teams"}
                                                         list={allTeams}
                                                         onChange={handleToggleChange}
                                                         variableName="addTeam"
                                                         disable={isLoadingTeams || teams.length > 5}/>
                                    :
                                    <FilterableTextField
                                        fieldName="Search and add players"
                                        list={allPlayers}
                                        onChange={handleToggleChange}
                                        variableName="addNewPlayer"
                                        disable={isPlayersLoading || players.length > 5}/>
                            }

                        </div>

                    </div>


                    <div style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <ToggleBar isVertical={false}
                                   values={["Compare Players", "Compare Teams"]}
                                   onChange={handleToggleChange}
                                   variableName="playerOrTeam"/>
                        <br/>
                        <ToggleBar isVertical={false} values={GAME_SITUATIONS}
                                   onChange={handleToggleChange}
                                   variableName="gameSituation"/>

                    </div>

                </div>

                <div>
                    {/*LIST OF SELECTED PLAYERS*/}
                    <div
                        style={{
                            display: "flex",
                            gap: "0.2rem",
                            flexWrap: "wrap",
                            height:"fit-content",
                            width:"20rem"
                        }}>
                        {comparingTeams
                            ? teams.map((team, index) =>
                                <div key={index}
                                     style={{
                                         backgroundColor: PLAYER_GRAPH_COLORS[index],
                                         padding: "0.5rem",
                                         borderRadius: "2rem",
                                         display: "flex"
                                     }}>
                                    {team.name}
                                    <div
                                        style={{
                                            paddingLeft: "1rem",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => {
                                            setTeams(teams.filter(t => t !== team))
                                        }}>x
                                    </div>
                                </div>)
                            : players.map((player, index) =>
                                <div key={index}
                                     style={{
                                         backgroundColor: PLAYER_GRAPH_COLORS[index],
                                         padding: "0.5rem",
                                         borderRadius: "2rem",
                                         display: "flex"
                                     }}>
                                    {player.PLAYER_NAME}
                                    <div
                                        style={{
                                            paddingLeft: "1rem",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => {
                                            setPlayers(players.filter(p => p !== player))
                                        }}>x
                                    </div>
                                </div>)
                        }
                        <p>
                            {comparingTeams?
                                teams.length < 2 ? "Select at least 2 teams to compare" :""
                                :
                                players.length < 2 ? "Select at least 2 players to compare" : ""
                            }
                        </p>
                    </div>
                    <br/>
                    {(gameSituation === "Quarters" || !gameSituation) &&
                        <ToggleBar isVertical={false} values={QUARTERS}
                                   onChange={handleToggleChange}
                                   variableName="quarter"
                        />}
                </div>

            </div>


            <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-evenly"
            }}>
                <ToggleBar isVertical={true} values={STAT_CATEGORIES}
                           onChange={handleToggleChange}
                           variableName="statCategory"/>
                {(players.length || teams.length) ?
                    <StyleComp players={players} gameSituation={gameSituation}
                               teams={teams} isComparingTeams={comparingTeams}
                               quarter={quarter} statCategory={statCategory}
                               dimensions={500}/>
                :<div style={{width:500}}></div>
                }
            </div>
        </div>

    </div>
    );
}

export default RadarPage;