# 必须要知道的一些自定义hook

## usePrevious

### 作用

> 保存上一次状态(state/memoized值)
### 实际场景

> 在购物车数量加减时，需要判断上次的数量和这次的数量，进行对比，然后判断是请求加入购物车接口还是移除购物车接口。(实际中可能是1个接口)

```js
//使用伪代码
import React,{ useState,useEffect } from 'react';
import { usePrevious } from '@parrotjs/react-hooks';

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
        }else{
            //请求移除购物车接口
        }
    },[count]);

    return (
        <>
            <button onClick={()=>setCount(count+1)}>加入购物车</button>
            <button onClick={()=>setCount(count-1)}>移除购物车</button>
        <>
    )
}

export default Demo;
```

### 代码

```js
export default function usePrevious(state){
    //使用useRef可以记录值 且不会被渲染重置 首次肯定为undefined 故不传值
    const previous=useRef();
    //每次渲染后都会执行
    useEffect(()=>{
        previous.current=state;
    });
    //可以获取到上一轮渲染的值
    return previous.current;
}
```

> usePrevious记录的值初始为空，每轮渲染后记录状态值，这样每次渲染返回的便是上一轮渲染时的值。

### 优化

> 上面这种写法即使上次的值没有发生任何改变，也会更新。这种做法实际上是可以优化的，即当上次更新的值和这次的一样，则不进行赋值操作。

```js
import React,{ useRef,useEffect } from 'react'; 

export default function usePrevious(
    state,
    compare= true
){

    const previous=useRef();

    useEffect(()=>{
        
        const needUpdate=typeof compare === 'function' ? compare(previous.current,state) : compare;

        if(needUpdate){
            previous.current=state;
        }

    });

    return previous.current;
    
}
```

> 第二个参数是一个方法或者布尔值，只有当返回值/值为true时，才进行更新。

## useUpdate

### 作用

> 强制组件重新渲染

### 实际场景

> 如下图，今年11月出台的个保法需要软件公司增加隐私协议，当用户点击同意时需要强制刷新。

```js
//伪代码
import React ,{useCallback,useState,useEffect} from 'react';
import { useUpdate } from '@parrotjs/react-hooks';

const Demo=()=>{
    //隐私弹框显示隐藏 
    const [visible,setVisible]=useState(false);
    const update=useUpdate();
    //点击同意
    const handleAgree=useCallback(()=>{
        update();
        setVisible(false);
    },[]);

    useEffect(()=>{
        setVisible(true);
    },[]);

    return (
        <>
            {visible && <Tankuang onAgree={handleAgree}>}
        </>
    )
}

export default Demo;
```

### 代码

```js
import { useState } from 'react';

export default function useUpdate(){
    //初始值为undefined
    const [__,forceUpdate]=useState<Object|undefined>();
    //返回一个方法 传一个空对象 前后state不一致 便会重新渲染
    return ()=>forceUpdate({});
}
```

> 利用了react中state变化为重新渲染这个特性

### 优化

1. useState的第一个参数用不到，可以省略
2. 使用useCallback包裹返回函数，避免重复渲染

```js
import { useState,useCallback } from 'react';

export default function useUpdate(){

    const [,forceUpdate]=useState<Object|undefined>();

    return useCallback(()=>forceUpdate({}),[]);
}
```

## useBoolean

### 作用

> 使其管理boolean值更有逼格

### 实际场景

> 接着还是使用上面的例子，里面的隐私弹框开启关闭可以使用这个hook进行代码的优雅美化。

### 代码

```js
import { useState,useCallback } from 'react';

export default function useBoolean(defaultValue:boolean){

    const [bool,setBool]=useState(defaultValue);

    const toggle=useCallback(
        () => {
            setBool(!bool);
        },
        [bool]
    );

    const setTrue=useCallback(
        () => {
            setBool(true);
        },
        []
    )

    const setFalse=useCallback(
        () => {
            setBool(false);
        },
        []
    )

    return [
        bool,
        {
            toggle,
            setTrue,
            setFalse
        }
    ]
}
```