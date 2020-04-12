import React from "react";
import Node from "./Node";
import { START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL } from "../util/constants";
import "../css/Grid.css";

interface Props {

}
  
interface State {
    grid: NodeType[][];
    rows: number;
    cols: number;
    mouseIsPressed: Boolean;
    startNodePressed: Boolean;
    finishNodePressed: Boolean;
    lastPressedRow: number;
    lastPressedCol: number;
    startNode: NodeType | null;
    finishNode: NodeType | null;
}

interface NodeType {
    row: number;
    col: number;
    isStart: Boolean;
    isFinish: Boolean;
    isVisited: Boolean;
}

const createNode = (row: number, col: number) => {
    return {
        row: row,
        col: col,
        isStart: (row === START_NODE_ROW && col === START_NODE_COL),
        isFinish: (row === FINISH_NODE_ROW && col === FINISH_NODE_COL),
        isVisited: false
    }
}

const getNewGrid = (state: State, row: number, col: number) => {
    const {grid, startNodePressed, finishNodePressed, lastPressedRow, lastPressedCol} = state;
    if (startNodePressed) { //&& !grid[row][col].isFinish) {
        grid[row][col].isStart = true;
        grid[lastPressedRow][lastPressedCol].isStart = false;
    }
    if (finishNodePressed) { //&& !grid[row][col].isStart) {
        grid[row][col].isFinish = true;
        grid[lastPressedRow][lastPressedCol].isFinish = false;
    }
    return grid;
  };



class Grid extends React.Component<Props> {
    state: State
    constructor(props: Props) {
        super(props);
        this.state = {
            grid: [],
            rows: 20,
            cols: 50,
            mouseIsPressed: false,
            startNodePressed: false,
            finishNodePressed: false,
            lastPressedRow: -1,
            lastPressedCol: -1,
            startNode: null,
            finishNode: null
        }
    }

    componentDidMount() {
        const {rows, cols} = this.state;
        let startNode = null;
        let finishNode = null;
        let grid: NodeType[][] = [];
        for (let i: number = 0; i < rows; i++) {
            let row: NodeType[] = [];
            for (let j: number = 0; j < cols; j++) {
                const node: NodeType = createNode(i, j)
                if (node.isStart) startNode = node;
                if (node.isFinish) finishNode = node;
                row.push(node);
            }
            grid.push(row);
        }
        this.setState({
            grid,
            startNode,
            finishNode
        });
    }

    handleMouseDown(row: number, col: number) {
        // console.log("down");
        // console.log(this.state.grid[row][col])
        const startNodePressed: Boolean = this.state.grid[row][col].isStart ? true : false;
        const finishNodePressed: Boolean = this.state.grid[row][col].isFinish ? true : false;
        this.setState({
            mouseIsPressed: true, 
            startNodePressed, 
            finishNodePressed, 
            lastPressedRow: row, 
            lastPressedCol: col
        });

    }
    
    handleMouseEnter(row: number, col: number) {
        if (!this.state.mouseIsPressed) return;
        // console.log("enter")
        // console.log(this.state.grid[row][col])
        const {grid, startNodePressed, finishNodePressed} = this.state;
        if ((startNodePressed && !grid[row][col].isFinish) || (finishNodePressed && !grid[row][col].isStart)) {
            const newGrid: NodeType[][] = getNewGrid(this.state, row, col);
            const node: NodeType = newGrid[row][col]
            if (node.isStart) {
                this.setState({grid: newGrid, lastPressedRow: row, lastPressedCol: col, startNode: node}); 
            } else if (node.isFinish) {
                this.setState({grid: newGrid, lastPressedRow: row, lastPressedCol: col, finishNode: node}); 
            }
        }
    }
    
    handleMouseUp() {
        // console.log("up")
        this.setState({mouseIsPressed: false});
    }

    getGrid() {
        const {grid} = this.state;
        return grid.map((row, rowIdx) => {
            return (
                <div key={rowIdx}>
                    {row.map((node, colIdx) => {
                        const {row, col, isStart, isFinish} = node;
                        return (
                            <Node 
                                key={colIdx}
                                row={row}
                                col={col}
                                isStart={isStart} 
                                isFinish={isFinish}
                                onMouseDown={(row: number, col: number) => this.handleMouseDown(row, col)}
                                onMouseEnter={(row: number, col: number) => this.handleMouseEnter(row, col)}
                                onMouseUp={() => this.handleMouseUp()}
                            >

                            </Node>
                        );
                    })}
                </div>
            );
        })
    }

    async dfs(grid: NodeType[][], row: number, col: number, endRow: number, endCol: number, visited: NodeType[]) {
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) return visited
        if (grid[endRow][endCol].isVisited) return visited

        grid[row][col].isVisited = true;   
        visited.push(grid[row][col])     
        if (visited.length-1) {
            const prevNode = visited[visited.length-2]
            const prevNodeEl: HTMLElement | null = document.getElementById(`node-${prevNode.row}-${prevNode.col}`);
            if (prevNodeEl?.className) {
                prevNodeEl.className = 'node node-visited';
            }
        }
        const currNodeEl: HTMLElement | null = document.getElementById(`node-${row}-${col}`);
        if (currNodeEl?.className) {
            currNodeEl.className = 'node node-current';
        }
        await new Promise(resolve => setTimeout(resolve, 50));

        // up
        if (row - 1 >= 0 && !grid[row-1][col].isVisited) {
            await this.dfs(grid, row-1, col, endRow, endCol, visited)
        }
        //right
        if (col + 1 < grid[row].length && !grid[row][col+1].isVisited) {
            await this.dfs(grid, row, col+1, endRow, endCol, visited);
        }
        //down
        if (row+1 < grid.length && !grid[row+1][col].isVisited) {
            await this.dfs(grid, row+1, col, endRow, endCol, visited);
        }
        //left
        if (col-1 >= 0 && !grid[row][col-1].isVisited) {
            await this.dfs(grid, row, col-1, endRow, endCol, visited);
        }
        return visited
    }

    async colorPath(visited: NodeType[]) {

        for (let i = 0; i < visited.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 5));
            const node = visited[i];
            const el: HTMLElement | null = document.getElementById(`node-${node.row}-${node.col}`);
            if (el?.className) {
                el.className = 'node node-shortest-path';
            }
        }      

    }

    async handleDFS() {
        const {grid, startNode, finishNode} = this.state;
        
        const visited = await this.dfs(
            grid, 
            startNode?.row as number, 
            startNode?.col as number,
            finishNode?.row as number,
            finishNode?.col as number,
            []
        )
        await this.colorPath(visited);
        
    }

    render() {
        return (
            <div className="grid">
                <button onClick={this.handleDFS.bind(this)}>DFS</button>
                {this.getGrid()}
            </div>
        );
    }
}

export default Grid