export interface IFunc {
    toggle: Function;
    setTrue: Function;
    setFalse: Function;
}
export default function useBoolean(defaultValue: boolean): Array<boolean | IFunc>;
