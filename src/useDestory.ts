import React, { EffectCallback } from 'react';

//销毁时的钩子
export default function useDestory(fn:any){
    React.useEffect(()=>{
        return fn;
    },[]);
}