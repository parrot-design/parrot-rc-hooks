
import React from 'react';
import useEventListener from './useEventListener';
import { inBrowser } from './utils';

export default function usePageVisibility(){

    const [ visibility,setVisibility ]=React.useState('visible');

    const setVisible=React.useCallback(()=>{
        if(inBrowser){
            setVisibility(document.hidden ? 'hidden' : 'visible');
        }
    },[]);

    useEventListener('visibilitychange',setVisible);

    return visibility;

}