import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import {MenuItem} from "@mui/material";

export default function FilterableTextField({fieldName,list, onChange, variableName}:
{fieldName:string,list:any[],onChange:(value:string,variableName:string) => void,variableName:string}) {
    const [inputValue, setInputValue] = React.useState('');
    const [filteredOptions, setFilteredOptions] = React.useState(list);

    const handleChange = (event:any) => {
        const value = event.target.value;
        setInputValue(value);
        setFilteredOptions(
            list.filter((option) =>
                option.displayName.toLowerCase().includes(value.toLowerCase())
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
                    helperText="Type to filter currencies"
                />
                {inputValue && (
                    <List>
                        {filteredOptions.map((option) => (
                            <MenuItem key={option.teamId} value={option.displayName}
                                      onClick={()=> {
                                          onChange(option.teamId,variableName)
                                          setInputValue(option.displayName)
                                      }
                            }>
                                {option.displayName}
                            </MenuItem>
                        ))}
                    </List>
                )}
            </div>
        </Box>
    );
}
