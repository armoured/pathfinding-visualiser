import React from "react";
import '../css/Node.css';

interface Props {
    row: number;
    col: number;
    isStart: Boolean;
    isFinish: Boolean;
    onMouseDown: Function;
    onMouseEnter: Function;
    onMouseUp: Function;
}
  
interface State {
    
}

class Node extends React.Component<Props> {
    state: State
    constructor(props: Props) {
        super(props);
        this.state = {}
    }

    classBuilder(isStart: Boolean, isFinish: Boolean): string {
        return isStart ? " node-start" : isFinish ? " node-finish" : ""
    }

    render() {
    
        const {row, col, isStart, isFinish, onMouseDown, onMouseEnter, onMouseUp} = this.props;
        const extraClass: string = this.classBuilder(isStart, isFinish);


        return (
            <div
                id={`node-${row}-${col}`}
                className={`node ${extraClass}`} 
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}
            >
            </div>
        );
    }
}


export default Node;