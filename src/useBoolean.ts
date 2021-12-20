import { useState,useCallback } from 'react';
 

export interface IFunc{ 
    toggle:Function;
    setTrue:Function;
    setFalse:Function;
}

export default function useBoolean(defaultValue:boolean):Array<boolean | IFunc>{

    const [bool,setBool]=useState<boolean>(defaultValue);

    const toggle=useCallback(
        () => {
            setBool(!bool);
        },
        [bool]
    );

    const setTrue=useCallback(
        () => {
            setBool(true);
        },
        []
    );

    const setFalse=useCallback(
        () => {
            setBool(false);
        },
        []
    );

    return [
        bool,
        {
            toggle,
            setTrue,
            setFalse
        }
    ]
}