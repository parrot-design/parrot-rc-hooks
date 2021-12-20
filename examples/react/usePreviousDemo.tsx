import React,{ useState,useEffect } from 'react';
import { usePrevious } from '../../src';

const Demo=()=>{
    //默认购物车有一件商品
    const [count,setCount]=useState(1);
    //上一个数量
    const prevCount=usePrevious(count);

    useEffect(()=>{
        //usePrevious默认值为undefined 初始化时不请求任何接口
        if(prevCount===undefined) return ;
        if(count>prevCount) {
            //请求添加购物车接口
            console.log("===加购===")
        }else{
            //请求移除购物车接口
            console.log("===减购===")
        }
    },[count]);

    return (
        <> 
            <button onClick={()=>setCount(count+1)}>加入购物车</button>
            <button onClick={()=>setCount(count-1)}>移除购物车</button>
        </>
    )
}

export default Demo;