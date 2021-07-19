import React from 'react';
import setRef from './setRef';

export type IRefs<T> = React.Ref<T>|null|undefined; 
/**
 * 给多个节点设置值
 * @param refs 
 * @returns 
 */
export default function useForkRef<Instance>(
    ...refs:IRefs<Instance>[]
){
    return React.useMemo(()=>{
        if(refs.every(ref=>!ref)){
            return null;
        }
        return (refValue: Instance | null)=>{
            for(let ref of refs){
                setRef(ref,refValue)
            }
        }
    },[...refs])
}