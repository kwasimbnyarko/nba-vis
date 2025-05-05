import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import {MenuItem} from "@mui/material";

export default function FilterableTextField(
    {fieldName,list, onChange, variableName, disable}:
        {fieldName:string,list:any[],onChange:(value:any,variableName:string)
        => void,variableName:string, disable?: boolean}) {

    const [inputValue, setInputValue] = React.useState('');
    const [filteredOptions, setFilteredOptions] = React.useState(list);


    //Currently handles team and player distinctions. Switch case would be better .
    const optionKeyValueNames =
        fieldName.toLowerCase().includes("team") ?
            {key:"TEAM_ID",value:"TEAM_NAME",name:"Teams"}
            :         {key:"PLAYER_ID",value:"PLAYER_NAME", name:"Players"}



    const handleChange = (event:any) => {
        const value = event.target.value;
        setInputValue(value);
        setFilteredOptions(
            list?.filter((option) =>
                option[optionKeyValueNames.value].toLowerCase().includes(value.toLowerCase())
            )
        );
    };


    return (
        <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField
                    id="filterable-textfield"
                    label={fieldName}
                    value={inputValue}
                    onChange={handleChange}
                    helperText= {`Type to filter ${optionKeyValueNames.name}`}
                    disabled={disable}
                />
                {inputValue && (
                    <List>
                        {filteredOptions?.map((option, index) =>
                            {if (index < 6) {
                                return (<MenuItem key={option[optionKeyValueNames.key]} value={option[optionKeyValueNames.value]}
                                      onClick={()=> {
                                          onChange(
                                              optionKeyValueNames.key === "PLAYER_ID" ?
                                      option : option[optionKeyValueNames.key]
                                              , variableName)
                                          setInputValue(option[optionKeyValueNames.value])
                                          setFilteredOptions([])
                                      }
                            }>
                                {option[optionKeyValueNames.value]}
                            </MenuItem>)}
                        }
                        )}
                    </List>
                )}
            </div>
        </Box>
    );
}
