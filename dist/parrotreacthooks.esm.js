import React, { useCallback } from 'react';

/**
 * 给节点设置值
 * @param ref 设置的节点
 * @param value 设置的值
 */
function setRef(ref, value) {
    if (typeof ref === 'function') {
        ref(value);
    }
    else {
        ref.current = value;
    }
}

/**
 * 给多个节点设置值
 * @param refs
 * @returns
 */
function useForkRef(...refs) {
    return React.useMemo(() => {
        if (refs.every(ref => !ref)) {
            return null;
        }
        return (refValue) => {
            for (let ref of refs) {
                setRef(ref, refValue);
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
    const isFocusVisibleRef = React.useRef(false);
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
    function handleFocusVisible() {
        if (isFocusVisible(event)) {
            isFocusVisibleRef.current = true;
            return true;
        }
        return false;
    }
    return { isFocusVisibleRef, onFocus: handleFocusVisible, onBlur: handleBlurVisible, ref };
}

export { setRef, useForkRef, useIsFocusVisible };
