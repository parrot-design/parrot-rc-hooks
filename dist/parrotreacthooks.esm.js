import * as React from 'react';
import React__default, { useCallback, useState, useRef, useEffect } from 'react';
import { inBrowser } from '@parrotjs/utils';

/**
 * 给节点设置值
 * @param ref 设置的节点
 * @param value 设置的值
 */
function setRef(ref, value) {
    if (typeof ref === 'function') {
        ref(value);
    }
    else if (!!ref) {
        ref.current = value;
    }
}

/**
 * 给多个节点设置值
 * @param refs
 * @returns
 */
function useForkRef(...refs) {
    return React__default.useMemo(() => {
        if (refs.every(ref => !ref)) {
            return null;
        }
        return (refValue) => {
            for (let ref of refs) {
                if (ref) {
                    setRef(ref, refValue);
                }
            }
        };
    }, [...refs]);
}

let hadKeyboardEvent = true;
let hadFocusVisibleRecently = false;
let hadFocusVisibleRecentlyTimeout = null;
const inputTypesWhitelist = {
    text: true,
    search: true,
    url: true,
    tel: true,
    email: true,
    password: true,
    number: true,
    date: true,
    month: true,
    week: true,
    time: true,
    datetime: true,
    'datetime-local': true
};
/**
 * 计算给定元素是否应自动触发 添加'focus-visible'类,即它是否应该始终匹配':focus-visible'当聚焦时。
 * @param node
 */
function focusTriggersKeyboardModality(node) {
    const { type, tagName } = node;
    if (tagName === 'INPUT' && inputTypesWhitelist[type] && !node.readOnly) {
        return true;
    }
    if (tagName === 'TEXTAREA' && !node.readOnly) {
        return true;
    }
    if (node.isContentEditable) {
        return true;
    }
    return false;
}
/**
 * 用hadKeyboardEvent变量跟踪我们的键盘状态。onkeydown是键盘按键事件，如果按下元、alt/选项、控制键，则不是键盘，其余都是
 * @param event
 * @returns
 */
function handleKeyDown(event) {
    if (event.metaKey || event.altKey || event.ctrlKey) {
        return;
    }
    hadKeyboardEvent = true;
}
/**
 * 表示远离键盘模式
 */
function handlePointerDown() {
    hadKeyboardEvent = false;
}
function handleVisibilityChange() {
    //当浏览器隐藏时会调用这个方法
    if (this.visibilityState === 'hidden') {
        if (hadFocusVisibleRecently) {
            hadKeyboardEvent = true;
        }
    }
}
function prepare(doc) {
    doc.addEventListener('keydown', handleKeyDown, true);
    //鼠标点击
    doc.addEventListener('mousedown', handlePointerDown, true);
    //物理设备
    doc.addEventListener('pointerdown', handlePointerDown, true);
    //手指
    doc.addEventListener('touchstart', handlePointerDown, true);
    doc.addEventListener('visibilitychange', handleVisibilityChange, true);
}
function isFocusVisible(event) {
    const { target } = event;
    try {
        //:focus-visible 是为了区分聚焦是按键状态还是鼠标状态的 :focus表示聚焦 而:focus-visible仅在键盘聚焦时才会发生
        return target.matches(':focus-visible');
    }
    catch (error) {
        // 如果浏览器不支持:focus-visible则使用我们的启发式
    }
    return hadKeyboardEvent || focusTriggersKeyboardModality(event);
}
function useIsFocusVisible() {
    const ref = useCallback((node) => {
        if (node != null) {
            prepare(node.ownerDocument);
        }
    }, []);
    const isFocusVisibleRef = React__default.useRef(false);
    /**
     * 如果一个blur失焦事件被触发，应该被调用
     */
    function handleBlurVisible() {
        if (isFocusVisibleRef.current) {
            hadFocusVisibleRecently = true;
            window.clearTimeout(hadFocusVisibleRecentlyTimeout);
            hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
                hadFocusVisibleRecently = false;
            }, 100);
            isFocusVisibleRef.current = false;
            return true;
        }
        return false;
    }
    /**
     * 如果一个focus聚焦事件被触发，应该被调用
     */
    function handleFocusVisible(event) {
        if (isFocusVisible(event)) {
            isFocusVisibleRef.current = true;
            return true;
        }
        return false;
    }
    return { isFocusVisibleRef, onFocus: handleFocusVisible, onBlur: handleBlurVisible, ref };
}

//更新完state以后的回调
//与setState({a:2},()=>{})等价
function useStateCallback(initial) {
    const [state, setState] = useState(initial);
    const asyncCallback = useRef();
    const setStateWrapper = (nextState, next, prev) => {
        if (typeof prev === 'function') {
            //prevState
            if (prev(state, nextState) === false) {
                return;
            }
        }
        asyncCallback.current = typeof next === 'function' ? next : null;
        setState(nextState);
    };
    useEffect(() => {
        if (asyncCallback.current)
            asyncCallback.current(state);
    }, [state]);
    return [state, setStateWrapper];
}

const MIN_DISTANCE = 10;
function getDirection(x, y) {
    if (x > y && x > MIN_DISTANCE) {
        return 'horizontal';
    }
    if (y > x && y > MIN_DISTANCE) {
        return 'vertical';
    }
    return '';
}
//判断方位的hooks
function useTouch() {
    //记录刚开始时的坐标
    const startX = useRef(0);
    const startY = useRef(0);
    //记录滑动距离
    const deltaX = useRef(0);
    const deltaY = useRef(0);
    //记录当前的坐标
    const offsetX = useRef(0);
    const offsetY = useRef(0);
    const direction = useRef('');
    const isVertical = () => direction.current === 'vertical';
    const isHorizontal = () => direction.current === 'horization';
    const reset = () => {
        deltaX.current = 0;
        deltaY.current = 0;
        offsetX.current = 0;
        offsetY.current = 0;
        direction.current = '';
    };
    const start = (event) => {
        reset();
        startX.current = event.touches[0].clientX;
        startY.current = event.touches[0].clientY;
    };
    const move = (event) => {
        const touch = event.touches[0];
        //Safari返回将设置clientX为负数
        deltaX.current = touch.clientX < 0 ? 0 : touch.clientX - startX.current;
        deltaY.current = touch.clientY - startY.current;
        offsetX.current = Math.abs(deltaX.current);
        offsetY.current = Math.abs(deltaY.current);
        if (!direction.current) {
            direction.current = getDirection(offsetX.current, offsetY.current);
        }
    };
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
    };
}

function useEventListener(type, listener, options) {
    if (!inBrowser)
        return;
    //passive 监听器能保证的只有一点，那就是调用 preventDefault() 无效
    const { target = window, passive = false, capture = false } = options || {};
    let attached = false;
    const add = React__default.useCallback((target) => {
        if (target && !attached) {
            target.addEventListener(type, listener, capture);
        }
        attached = true;
    }, [type, listener, passive, capture]);
    const remove = React__default.useCallback((target) => {
        if (target && attached) {
            target.removeEventListener(type, listener, capture);
            attached = false;
        }
    }, [type, listener, passive, capture]);
    React__default.useEffect(() => {
        add(target);
        return () => {
            remove(target);
        };
    }, [target]);
}

function usePageVisibility() {
    const [visibility, setVisibility] = React__default.useState('visible');
    const setVisible = React__default.useCallback(() => {
        if (inBrowser) {
            setVisibility(document.hidden ? 'hidden' : 'visible');
        }
    }, []);
    useEventListener('visibilitychange', setVisible);
    return visibility;
}

const useRect = (deps = []) => {
    const [size, setSize] = useState({
        width: 0, height: 0
    });
    const root = useRef(null);
    const changeSize = () => {
        var _a;
        const rect = (_a = root.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (rect) {
            setSize({
                width: rect.width,
                height: rect.height
            });
        }
    };
    useEffect(() => {
        changeSize();
    }, deps);
    return {
        root,
        size,
        changeSize
    };
};

//销毁时的钩子
function useDestory(fn) {
    React__default.useEffect(() => {
        return fn;
    }, []);
}

function useResizeObserver({ ref, onResize: resizeHandler, disabled, }) {
    const observerRef = React.useRef();
    const elementRef = React.useRef();
    const [height, setHeight] = React.useState(0);
    const [width, setWidth] = React.useState(0);
    const [offsetHeight, setOffsetHeight] = React.useState(0);
    const [offsetWidth, setOffsetWidth] = React.useState(0);
    const destroyObserver = React.useCallback(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }
    }, [observerRef]);
    const onResize = React.useCallback((entries) => {
        const target = entries[0].target;
        const { width: _width, height: _height } = target.getBoundingClientRect();
        const { offsetWidth: _offsetWidth, offsetHeight: _offsetHeight } = target;
        /**
         * Resize observer trigger when content size changed.
         * In most case we just care about element size,
         * let's use `boundary` instead of `contentRect` here to avoid shaking.
         */
        const fixedWidth = Math.floor(_width);
        const fixedHeight = Math.floor(_height);
        if (width !== fixedWidth ||
            height !== fixedHeight ||
            offsetWidth !== _offsetWidth ||
            offsetHeight !== _offsetHeight) {
            setHeight(fixedHeight);
            setWidth(fixedWidth);
            setOffsetHeight(_offsetHeight);
            setOffsetWidth(_offsetWidth);
            if (resizeHandler) {
                Promise.resolve().then(() => {
                    resizeHandler({
                        width: fixedWidth,
                        height: fixedHeight,
                        offsetWidth: _offsetWidth,
                        offsetHeight: _offsetHeight,
                    }, target);
                });
            }
        }
    }, [width, height, offsetWidth, offsetHeight, resizeHandler]);
    const repopulateObserver = React.useCallback(() => {
        if (disabled) {
            destroyObserver();
            return;
        }
        const element = ref.current;
        const elementChanged = element !== elementRef.current;
        if (elementChanged) {
            destroyObserver();
            elementRef.current = element;
        }
        if (!observerRef.current && element) {
            observerRef.current = new ResizeObserver(onResize);
            observerRef.current.observe(element);
        }
    }, [destroyObserver, disabled, onResize, ref]);
    React.useEffect(() => {
        repopulateObserver();
        // eslint-disable-next-line consistent-return
        return () => {
            destroyObserver();
        };
    }, [repopulateObserver, destroyObserver]);
    return {
        width,
        height,
        offsetWidth,
        offsetHeight,
    };
}

function usePrevious(state, compare = true) {
    const previous = useRef();
    useEffect(() => {
        const needUpdate = typeof compare === 'function' ? compare(previous.current, state) : compare;
        if (needUpdate) {
            previous.current = state;
        }
    });
    return previous.current;
}

function useUpdate() {
    const [, forceUpdate] = useState();
    return useCallback(() => forceUpdate({}), []);
}

function useBoolean(defaultValue) {
    const [bool, setBool] = useState(defaultValue);
    const toggle = useCallback(() => {
        setBool(!bool);
    }, [bool]);
    const setTrue = useCallback(() => {
        setBool(true);
    }, []);
    const setFalse = useCallback(() => {
        setBool(false);
    }, []);
    return [
        bool,
        {
            toggle,
            setTrue,
            setFalse
        }
    ];
}

export { setRef, useBoolean, useDestory, useEventListener, useForkRef, useIsFocusVisible, usePageVisibility, usePrevious, useRect, useResizeObserver, useStateCallback, useTouch, useUpdate };
