import { useState,useEffect,useRef } from 'react';
//更新完state以后的回调
//与setState({a:2},()=>{})等价
export default function useStateCallback(initial:any){

    const [state,setState]=useState(initial);

    const asyncCallback=useRef<Function>();

    const setStateWrapper=(nextState:any,next:Function,prev?:any)=>{
        if(typeof prev==='function'){
            //prevState
            if(prev(state,nextState)===false){
                return ;
            }
        }

        (asyncCallback.current as any)=typeof next==='function'?next:null; 
     
        setState(nextState);
    }

    useEffect(()=>{
        if(asyncCallback.current) asyncCallback.current(state);
    },[state]);

    return [state,setStateWrapper]
}