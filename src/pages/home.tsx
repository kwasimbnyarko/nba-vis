import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import { getAllTeams, getPlayersPerTeam} from "../services/rapidApiNba";
import ToggleBar from "../components/ToggleBar";
import Typography from "@mui/material/Typography";
import FilterableTextField from "../components/SelectTextField";

function Home(){

    const [teamId, setTeamId] = useState<number>(9)
    const [team2Id, setTeam2Id] = useState<number>(1)

    const [gameSituation, setGameSituation] = useState<string>("")
    const [quarter, setQuarter] = useState<string>("")
    const [statCategory, setStatCategory] = useState<string>("")

    const gameSituations = ["Quarters","Clutch","Ahead by 10", "Behind by 10"]
    const quarters = ["Q1", "Q2", "Q3", "Q4"]
    const statCategories = ["General", "Offensive", "Defensive"]

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
            default:
                console.error("No variable selected")
                break;
        }
    };


    const { data: allTeams, isLoading: isTeamsLoading } = useQuery({
        queryKey: ["allTeams"],
        queryFn: () => getAllTeams(),
    });

    const {data: teamPlayers, isLoading: teamPlayersLoading } = useQuery({
        queryKey: ["teamPlayers", teamId],
        queryFn: () => getPlayersPerTeam(teamId)
    })

    const {data: team2Players, isLoading: team2PlayersLoading } = useQuery({
        queryKey: ["teamPlayers", team2Id],
        queryFn: () => getPlayersPerTeam(team2Id)
    })

    return (
    <div>
        <div className="play-style-section" style={{padding:"5rem"}}>
            <Typography variant="h3">Play Style</Typography>
            <FilterableTextField fieldName="Team" list={allTeams} onChange={handleToggleChange} variableName="team1"/>
            <div style={{display:"flex", flexDirection:"column",alignItems:"center"}}>
                <ToggleBar isVertical={false} values={gameSituations} onChange={handleToggleChange} variableName="gameSituation"/>
                <br/>
                {(gameSituation==="Quarters") && <ToggleBar isVertical={false} values={quarters} onChange={handleToggleChange} variableName="quarter"/>}
            </div>

            <br/>
            <ToggleBar isVertical={true} values={statCategories} onChange={handleToggleChange} variableName="statCategory"/>
        </div>

    </div>
    );
}

export default Home;