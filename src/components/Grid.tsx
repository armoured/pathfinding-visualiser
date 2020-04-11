import React from "react";
import Node from "./Node";
import "../css/Grid.css";

interface Props {

}
  
interface State {
    nodes: Object[][];
    rows: number;
    cols: number
}

class Grid extends React.Component<Props> {
    state: State
    constructor(props: Props) {
        super(props);
        this.state = {
            nodes: [],
            rows: 15,
            cols: 50
        }
    }

    componentDidMount() {
        const {rows, cols} = this.state;
        let nodes: Object[][] = [];
        for (let i = 0; i < rows; i++) {
            let row: Object[] = [];
            for (let j = 0; j < cols; j++) {
                row.push([]);
            }
            nodes.push(row);
        }
        this.setState({
            nodes
        });
    }

    getGrid() {
        const {nodes} = this.state;
        return nodes.map((row, rowIdx) => {
            return (
                <div key={rowIdx}>
                    {row.map((node, colIdx) => 
                        <Node key={colIdx} />
                    )}
                </div>
            );
        })
    }

    render() {
        return (
            <div className="grid">
                {this.getGrid()}
            </div>
        );
    }
}

export default Grid