import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ToggleBar({isVertical, values, onChange, variableName} :
{isVertical:boolean,
    values:any[],
    onChange: (value: any,variableName:string) => void,
variableName:string}) {
    const [selectedValue, setSelectedValue] = React.useState<string>(values[0]);

    const handleSelection = (
        event: React.MouseEvent<HTMLElement>,
        newValue: string,
    ) => {
        console.log(newValue)
        if (newValue !== null) {
            setSelectedValue(newValue);
            onChange(newValue, variableName)
        }
    };

    return (
        <ToggleButtonGroup
            orientation={isVertical ? "vertical" : "horizontal"}
            defaultValue={values[0]}
            value={selectedValue}
            exclusive
            onChange={handleSelection}
        >
            {values.map((value)=>(
                <ToggleButton value={value}>
                    {value}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
