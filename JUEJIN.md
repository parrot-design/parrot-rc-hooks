# 必须要知道的一些自定义hook

## usePrevious

### 作用

> 保存上一次状态(state/memoized值)
### 实际场景

> 在购物车数量加减时，需要判断上次的数量和这次的数量，进行对比，然后判断是请求加入购物车接口还是移除购物车接口。

### 代码

```js
export default function usePrevious<T>(state:T){
    //使用useRef可以记录值 且不会被渲染重置 首次肯定为undefined 故不传值
    const previous=useRef<T>();
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
```

> 第二个参数是一个方法或者布尔值，只有当返回值/值为true时，才进行更新。

## useUpdate

### 作用

> 强制组件重新渲染

### 实际场景

> 如下图，今年11月出台的个保法需要软件公司增加隐私协议，当用户点击同意时需要强制刷新。

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


