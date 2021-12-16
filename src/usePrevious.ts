import React,{ useRef,useEffect } from 'react';

export type compareFuncType<T>=(prev:T|undefined,next:T)=>boolean 

export default function usePrevious<T>(
    state:T,
    compare:compareFuncType<T> | boolean = true
):T | undefined{

    const previous=useRef<T>();

    useEffect(()=>{
        
        const needUpdate=typeof compare === 'function' ? compare(previous.current,state) : compare;

        if(needUpdate){
            previous.current=state;
        }

    });

    return previous.current;
    
}