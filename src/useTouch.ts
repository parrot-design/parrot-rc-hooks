import React, { useRef } from 'react';

const MIN_DISTANCE = 10;

function getDirection(x:number,y:number){
    if(x > y && x>MIN_DISTANCE){
        return 'horizontal';
    }
    if(y > x && y>MIN_DISTANCE){
        return 'vertical';
    }
    return '';
}

//判断方位的hooks
export default function useTouch(){

    //记录刚开始时的坐标
    const startX=useRef(0);
    const startY=useRef(0);

    //记录滑动距离
    const deltaX=useRef(0);
    const deltaY=useRef(0);

    //记录当前的坐标
    const offsetX=useRef(0);
    const offsetY=useRef(0);

    const direction=useRef('');

    const isVertical=()=>direction.current==='vertical';
    const isHorizontal=()=>direction.current==='horization';

    const reset=()=>{
        deltaX.current=0;
        deltaY.current=0;
        offsetX.current=0;
        offsetY.current=0;
        direction.current='';
    }

    const start=(event:any)=>{
        reset();
        startX.current=event.touches[0].clientX;
        startY.current=event.touches[0].clientY;
    }

    const move=(event:any)=>{
        const touch=event.touches[0];
        //Safari返回将设置clientX为负数
        deltaX.current=touch.clientX < 0 ? 0 : touch.clientX - startX.current;
        deltaY.current=touch.clientY - startY.current;
        offsetX.current=Math.abs(deltaX.current);
        offsetY.current=Math.abs(deltaY.current);

        if(!direction.current){
            direction.current=getDirection(offsetX.current, offsetY.current)
        }
    }

    return {
        move,
        start,
        reset,
        startX,
        startY,
        deltaX,
        deltaY,
        offsetX,
        offsetY,
        direction,
        isVertical,
        isHorizontal
    }
}