import React from 'react';
import Square from '../Square/Square.js';
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
            const hasError = this.hasError(column, row, errors);

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

      hasError(x, y, errors) {
        for (let error of errors) {
          if (error.x === x && error.y === y) {
            return true;
          }
        }
        return false;
      }
      
      getErrors() {
        let errors = [];
        for (let i = 0; i < this.state.currentBoard.length; i++) {
          for (let j = 0; j < this.state.currentBoard[i].length; j++) {
            const currentSquareErrors = this.getRowErrors(i, j).concat(this.getColumnErrors(i, j)).concat(this.getRegionErrors(i, j));
            if (currentSquareErrors.length > 0) {
              errors = errors.concat(currentSquareErrors);
            }
          }
        }
        return errors;
      }

      //TODO: The code to check rows and columns is super similar... See if the logic
      //can be combined somehow...
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
          //right now, we will say this square constitutes an error iff: 
          //  1) it duplicates another number in this row, and
          //  2) it was *not* part of the initial board (since we only want to highlight user errors)
          if (valueInRow === currentNumber && !this.getInitialBoardValue(curX, y)) {
            errors.push(new Error(curX, y));
          }
        }
        return errors;
      }

      getColumnErrors(x, y) {
        const currentNumber = this.getBoardValue(x, y);
        const errors = [];
        if (!currentNumber) {
          return errors;
        }
        for (let curY = 0; curY < 9; curY++) {
          if (curY === y) {
            continue;
          }
          const valueInRow = this.getBoardValue(x, curY);
          if (valueInRow === currentNumber && !this.getInitialBoardValue(x, curY)) {
            errors.push(new Error(x, curY));
          }
        }
        return errors;
      }

      getRegionErrors(x, y) {
        const currentNumber = this.getBoardValue(x, y);
        const errors = [];
        if (!currentNumber) {
          return errors;
        }
        
        //get the top-left coordinate of whichever region this square is in
        const rowOffset = x < 3 ? 0 : x < 6 ? 3 : 6;
        const columnOffset = y < 3 ? 0 : y < 6 ? 3 : 6;
        for (let row = rowOffset; row < rowOffset + 3; row++) {
          for (let column = columnOffset; column < columnOffset + 3; column++) {
            if (x === column && y === row) {
              continue;
            }
            
            const value = this.getBoardValue(column, row);
            if (value === currentNumber && !this.getInitialBoardValue(column, row)) {
              errors.push(new Error(column, row));
            }
          }
        }

        return errors;
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

      /** @return True iff this sudoku puzzle is solved */
      isSolved() {
        //if there are any errors, then (obviously) the puzzle isn't solved
        const errors = this.getErrors();
        if (errors) {
          return false;
        }
        
        //if any square doesn't have an entry, then the puzzle can't be solved.
        for (let i = 0; i < this.state.currentBoard; i++) {
          for (let j = 0; j < this.state.currentBoard[i]; j++) {
            if (!this.state.currentBoard[i][j]) {
              return false;
            }
          }
        }
        return true;
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
