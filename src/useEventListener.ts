
import React from 'react';
import { inBrowser } from './utils';

//是否支持捕获
export let supportsPassive = false;

export default function useEventListener(
    type:string,
    listener:any,
    options?:any
){

    if(!inBrowser) return ;
    //passive 监听器能保证的只有一点，那就是调用 preventDefault() 无效
    const { target=window,passive=false,capture=false }:{target:any;passive:boolean;capture:boolean}=options||{};

    let attached:boolean=false;

    const add=React.useCallback((target:any)=>{
        if(target && !attached){
            target.addEventListener(
                type,
                listener,
                supportsPassive?{passive,capture}:capture
            )
        }
        attached=true;
    },[type,listener,passive,capture]);

    const remove=React.useCallback((target:any)=>{
        if(target && attached){
            target.removeEventListener(type,listener,capture);
            attached=false;
        }
    },[type,listener,passive,capture])

    React.useEffect(() => { 
        add(target)

        return ()=>{
            remove(target)
        }
    }, [target])

}