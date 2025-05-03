import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import { getAllTeams, getPlayersPerTeam} from "../services/rapidApiNba";
import ToggleBar from "../components/ToggleBar";
import Typography from "@mui/material/Typography";
import FilterableTextField from "../components/SelectTextField";
import RadarChart from "../charts/RadarChart";
import {GAME_SITUATIONS,QUARTERS,STAT_CATEGORIES} from "../utils/constants";
import {Player} from "../models/player";


function Home(){

    const [teamId, setTeamId] = useState<number>(9)
    const [team2Id, setTeam2Id] = useState<number>(1)

    const [players, setPlayers] = useState<any[]>([])

    const [gameSituation, setGameSituation] = useState<string>("")
    const [quarter, setQuarter] = useState<string>("")
    const [statCategory, setStatCategory] = useState<string>("")

    const handleToggleChange = (value: any,variableName:string) => {
        console.log('New selected value:', value);
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
            case "team1":
                setTeamId(value)
                break;
            case "team2":
                console.log("team id "+value)
                setTeam2Id(value)
                break;
            case "addNewPlayer":
                console.log("add player "+value)
                setPlayers([...players,value])
                console.log(players)
                break
            default:
                console.error("No variable selected")
                break;
        }
    };


    const { data: allTeams , isLoading: isLoadingTeams } = useQuery({
        queryKey: ["allTeams"],
        queryFn: () => getAllTeams(),
    });

    const {data: teamPlayers, isLoading: isTeeamPlauersLoading} = useQuery({
        queryKey: ["teamPlayers", teamId],
        queryFn: () => getPlayersPerTeam(teamId)
    })

    return (
    <div>
        <div className="play-style-section" style={{padding:"5rem"}}>
            <Typography variant="h3">Play Style</Typography>

            <div className="player-team-selection-area" style={{display:"flex", justifyContent:"space-around"}}>
                <div>
                    <FilterableTextField fieldName="Team 1" list={allTeams} onChange={handleToggleChange}
                                         variableName="team1" disable={isLoadingTeams}/>

                    <FilterableTextField fieldName="Player 1" list={teamPlayers} onChange={handleToggleChange}
                                         variableName="addNewPlayer" disable={isTeeamPlauersLoading}/>

                </div>

                {

                }
                {/*<div>*/}
                {/*    <FilterableTextField fieldName="Team 2" list={allTeams} onChange={handleToggleChange}*/}
                {/*                         variableName="team1"/>*/}

                {/*    <FilterableTextField fieldName="Player 2" list={team2Players} onChange={handleToggleChange}*/}
                {/*                         variableName="player1"/>*/}

                {/*</div>*/}
            </div>


            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <ToggleBar isVertical={false} values={GAME_SITUATIONS} onChange={handleToggleChange}
                           variableName="gameSituation"/>
                <br/>
                {(gameSituation === "Quarters") &&
                    <ToggleBar isVertical={false} values={QUARTERS} onChange={handleToggleChange}
                               variableName="quarter"/>}
            </div>

            <br/>


            <div style={{display:"flex", alignItems:"center", justifyContent:"space-evenly"}}>
                <ToggleBar isVertical={true} values={STAT_CATEGORIES} onChange={handleToggleChange}
                           variableName="statCategory"/>
                { (players.length) &&
                    <RadarChart players={players} gameSituation={gameSituation}
                                quarter={quarter} statCategory={statCategory}
                                dimensions={500}/>}
            </div>
        </div>

    </div>
    );
}

export default Home;