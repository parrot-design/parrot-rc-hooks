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

> 在ahook中，他的第二个参数表示是否需要更新值，因为上面这种写法即使上次的值没有发生任何改变，也会更新。这种做法实际上是可以优化的，即当上次更新的值和这次的一样，则不进行赋值操作。

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

