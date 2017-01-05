import React from 'react';
import Square from './square.js';
import './Board.css';


/**
 * The actual 9x9 sudoku game board
 */
export default class Board extends React.Component {
    constructor() {
      super();
      this.state = {
        initialBoard: this.getEmptyBoard(getInitialBoard()),
        currentBoard: this.getEmptyBoard(getInitialBoard())
      };
    }
    render() {
      const regions = this.getRegions();
      const firstRow = regions.slice(0, 3);
      const secondRow = regions.slice(3, 6);
      const thirdRow = regions.slice(6, 9);
      return (
        <div className="board">
          <div className="row">
            {firstRow}
          </div>
          <div className="row">
            {secondRow}
          </div>
          <div className="row">
            {thirdRow}
          </div>
        </div>
      );
    }

      getRegions() {
        const regions = [];
        const errors = this.getErrors();
        const rowsWithErrors = [];
        for (let i = 0; i < errors.length; i++) {
          rowsWithErrors.push(errors[i].y);
        }
        console.log(rowsWithErrors);
        console.log(errors);
        for (let row = 0; row < 3; row++) {
          for (let column = 0; column < 3; column++) {
            regions.push(this.getRegion(row, column, errors));
          }
        }
        return regions;
      }

      /**
       * Returns a single region of the Sudoku board.
       *
       *   -------------------------------------
       *   |           |           |           |
       *   |   (0,0)   |    (1,0)  |   (2,0)   |
       *   |           |           |           |
       *   -------------------------------------
       *   |           |           |           |
       *   |   (0,1)   |    (1,1)  |   (2,1)   |
       *   |           |           |           |
       *   -------------------------------------
       *   |           |           |           |
       *   |   (0,2)   |    (1,2)  |   (2,2)   |
       *   |           |           |           |
       *   -------------------------------------
       *
       *
       * @param {number} x The x-coordinate of the region (between 0 and 2)
       * @param {number} y The y-coordinate of the region (between 0 and 2)
       * @return {Region} The region of the board at the specified coordinate
       */
      getRegion(x, y, errors) {
        const rowOffset = x === 0 ? 0 : x === 1 ? 3 : 6;
        const columnOffset = y === 0 ? 0 : y === 1 ? 3 : 6;
        const squares = Array(9).fill(null);
        let iter = 0;
        for (let row = rowOffset; row < rowOffset + 3 ; row++) {
          for (let column = columnOffset; column < columnOffset + 3; column++) {
            const key = '(' + column + ',' + row + ')';
            const rowErrors = this.getRowErrors(column, row);
            const hasError = rowErrors.length > 0;

            squares[iter] = <Square key={key} 
                                    hasError={hasError}
                                    initialNumber={this.state.initialBoard[row][column]}
                                    currentNumber={this.getBoardValue(column, row)} 
                                    onSquareChange={(value) => this.setBoardValue(column, row, value)}/>
            iter++;
          }
        }
        const key = '(' + y + ',' + x + ')';
        return (
          <Region key={key} squares={squares} />
        )
      }

      // (row, col)
      getEmptyBoard(initialBoard) {
        const board = Array(9).fill(null);
        for (let i = 0; i < board.length; i++) {
          board[i] = Array(9).fill(null);
          for (let j = 0; j < board[i].length; j++) {
            board[i][j] = initialBoard[i][j];
          }
        }
        return board;
      }

      getRowErrors(x, y) {
        const currentNumber = this.getBoardValue(x, y);
        const errors = [];
        if (!currentNumber) {
          return errors;
        }
        for (let curX = 0; curX < 9; curX++) {
          if (curX === x) {
            continue;
          }
          const valueInRow = this.getBoardValue(curX, y);
          if (valueInRow === currentNumber && this.getInitialBoardValue(curX, y)) {
            errors.push(new Error(curX, y));
          }
        }
        return errors;
      }

      checkColumn(x, y) {
        return [];
      }

      checkRegion(x, y) {
        return [];
      }

      getInitialBoardValue(x, y) {
        return this.state.initialBoard[y][x];
      }

      getBoardValue(x, y) {
        return this.state.currentBoard[y][x];
      }

      setBoardValue(x, y, value) {
        this.state.currentBoard[y][x] = value;
      }


      getErrors() {
        let errors = [];
        for (let i = 0; i < this.state.currentBoard.length; i++) {
          for (let j = 0; j < this.state.currentBoard[i].length; j++) {
            const rowError = this.getRowErrors(i, j);
            if (rowError.length > 0) {
              errors = errors.concat(rowError);
            }
          }
        }
        return errors;
      }

}



/**
  * A single 3x3 region in a Sudoku board.
  */
class Region extends React.Component {
  render() {
    return (
      <div className="region">
        {this.props.squares}
      </div>
    );
  }

}

//test board. Replace with ajax call eventually
function getInitialBoard() {
  return [
    ["", "", "", "", "", "", "", "", ""],
    ["", "8", "9", "4", "1", "", "", "", ""],
    ["", "", "6", "7", "", "", "1", "9", "3"],
    ["2", "", "", "", "", "", "7", "", ""],
    ["3", "4", "", "6", "", "", "", "1", ""],
    ["", "", "", "9", "", "", "", "", "5"],
    ["", "", "", "", "2", "", "", "5", ""],
    ["6", "5", "", "", "4", "", "", "2", ""],
    ["7", "3", "", "1", "", "", "", "", ""]
  ]
}

class Error {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
