import * as React from 'react';
export interface UseResizeObserverArgs {
    ref: React.RefObject<React.ReactNode>;
    onResize?: any;
    disabled?: boolean;
}
export declare function useResizeObserver({ ref, onResize: resizeHandler, disabled, }: UseResizeObserverArgs): any;
export default useResizeObserver;
