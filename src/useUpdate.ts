import { useState,useCallback } from 'react';

export default function useUpdate(){

    const [,forceUpdate]=useState<Object|undefined>();

    return useCallback(()=>forceUpdate({}),[]);
}