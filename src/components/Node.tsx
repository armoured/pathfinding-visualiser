import React from "react";
import '../css/Node.css';

interface Props {

}
  
interface State {
    
}

class Node extends React.Component<Props> {
    state: State
    constructor(props: Props) {
        super(props);
        this.state = {}
    }

    handleClick(e: any) {
        console.log("sup");
    }

    render() {
        return (
            <div className="node" onClick={this.handleClick}></div>
        );
    }
}


export default Node;