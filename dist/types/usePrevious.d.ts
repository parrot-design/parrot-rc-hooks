export declare type compareFuncType<T> = (prev: T | undefined, next: T) => boolean;
export default function usePrevious<T>(state: T, compare?: compareFuncType<T> | boolean): T | undefined;
