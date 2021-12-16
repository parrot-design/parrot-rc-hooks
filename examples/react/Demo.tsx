import React ,{ useState } from 'react';
import { usePrevious,useUpdate } from '../../src'

const Demo = () => {

    const update=useUpdate(); 
     
    console.log("===demo render===")

    return (
        <div>  
            <Children forceUpdate={update} />
        </div>
    )
}

const Children=React.memo((props:any)=>{
    console.log("===Children")
    return (
        <div onClick={props.forceUpdate}>forceUpdate</div>
    )
})

export default Demo;