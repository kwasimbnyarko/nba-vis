import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import { getAllTeams, getPlayersPerTeam} from "../services/rapidApiNba";
import ToggleBar from "../components/ToggleBar";
import Typography from "@mui/material/Typography";
import FilterableTextField from "../components/SelectTextField";
import RadarChart from "../charts/RadarChart";
import {GAME_SITUATIONS,QUARTERS,STAT_CATEGORIES} from "../utils/constants";
import {Player} from "../models/player";
import StyleComp from "../components/StyleComp";


function Home(){

    const [teamId, setTeamId] = useState<any>(null)
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
                // console.log(players)
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

    const {data: teamPlayers, isLoading: isTeamPlayersLoading} = useQuery({
        queryKey: ["teamPlayers", teamId],
        queryFn: () => getPlayersPerTeam(teamId),
        enabled: !!teamId
    })

    return (
    <div>
        <div className="play-style-section" style={{padding:"5rem"}}>
            <Typography variant="h3">Play Style</Typography>

            <div className="player-team-selection-area"
                 style={{display:"flex", justifyContent:"space-around"}}>
                <div>
                    <FilterableTextField fieldName="Team" list={allTeams}
                                         onChange={handleToggleChange}
                                         variableName="team1"
                                         disable={isLoadingTeams}/>

                    <FilterableTextField fieldName="Player" list={teamPlayers}
                                         onChange={handleToggleChange}
                                         variableName="addNewPlayer"
                                         disable={isTeamPlayersLoading
                                             || teamId === null}/>

                </div>

            </div>


            <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center"}}>
                <ToggleBar isVertical={false} values={GAME_SITUATIONS}
                           onChange={handleToggleChange}
                           variableName="gameSituation"/>
                <br/>
                {(gameSituation === "Quarters") &&
                    <ToggleBar isVertical={false} values={QUARTERS}
                               onChange={handleToggleChange}
                               variableName="quarter"/>}
            </div>

            <br/>


            <div style={{
                display:"flex", alignItems:"center",
                justifyContent:"space-evenly"}}>
                <ToggleBar isVertical={true} values={STAT_CATEGORIES}
                           onChange={handleToggleChange}
                           variableName="statCategory"/>
                { (players.length) &&
                    <StyleComp players={players} gameSituation={gameSituation}
                                quarter={quarter} statCategory={statCategory}
                                dimensions={500}/>}
            </div>
        </div>

    </div>
    );
}

export default Home;