import React ,{ useRef } from 'react';
import { TransitionGroup }from 'react-transition-group';
import { useForkRef } from '../../src';

const Ripple = (props:any) => {

    const { timeout, num,onExited,in:inProp } = props;  

    React.useEffect(() => { 
        const timeoutId = setTimeout(()=>{console.log("onExited")}, timeout);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [timeout,onExited])

    return (
        <div>测试{num}</div>
    )
}

const Demo = () => {

    const num = React.useRef(1);

    const [children, setChildren] = React.useState([<Ripple num={num.current} />])

    const extraRef=useRef(null);

    const handleAdd = () => {
        setChildren(oldChildren => {
            num.current += 1;
            return [
                ...oldChildren,
                <Ripple num={num.current} />
            ]
        })
    }

    const handleRef=useForkRef(extraRef,(ref)=>{
        console.log("ref",ref)
    })

    return (
        <div>
            <TransitionGroup component={null} exit >
                {children}
            </TransitionGroup>

            <button onClick={handleAdd} ref={handleRef}>添加</button>
        </div>
    )
}

export default Demo;