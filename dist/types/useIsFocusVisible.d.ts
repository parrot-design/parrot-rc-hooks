import React from 'react';
export declare function teardown(doc: any): void;
export default function useIsFocusVisible(): {
    isFocusVisibleRef: React.MutableRefObject<boolean>;
    onFocus: () => boolean;
    onBlur: () => boolean;
    ref: (node: any) => void;
};
