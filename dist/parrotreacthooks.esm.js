import React from 'react';

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

export { setRef, useForkRef };
