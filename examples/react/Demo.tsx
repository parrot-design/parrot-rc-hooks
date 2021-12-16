import React ,{ useState } from 'react';
import { usePrevious } from '../../src'

const Demo = () => {

    const [count,setCount]=useState(0);

    const lastCount=usePrevious(count); 
     
    return (
        <div> 
            <button onClick={()=>setCount(count+1)}>加入购物车</button>
            <div>现在的值：{count}</div>
            <div>上次的值：{lastCount}</div>
        </div>
    )
}

export default Demo;