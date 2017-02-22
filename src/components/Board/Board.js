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
        currentBoard: this.getEmptyBoard(getInitialBoard()),
        selectedSquare: null
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
        for (let row = 0; row < 3; row++) {
          for (let column = 0; column < 3; column++) {
            regions.push(this.getRegion(row, column));
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
      getRegion(x, y) {
        const rowOffset = x === 0 ? 0 : x === 1 ? 3 : 6;
        const columnOffset = y === 0 ? 0 : y === 1 ? 3 : 6;
        const squares = Array(9).fill(null);
        let iter = 0;
        for (let row = rowOffset; row < rowOffset + 3 ; row++) {
          for (let column = columnOffset; column < columnOffset + 3; column++) {
            const key = '(' + column + ',' + row + ')';
            const error = this.props.selectedError;
            const isError = this.props.selectedError == null ? false : error.x === column && error.y === row;

            const curSquareIsSelected = this.isSquareSelected(row, column);
            const isConflict = this.props.selectedError === null ? false : this.props.selectedError.hasConflict(column, row);
            squares[iter] = <Square key={key} 
                                    isError={isError}
                                    isConflict={isConflict}
                                    initialNumber={this.state.initialBoard[row][column]}
                                    currentNumber={this.getBoardValue(column, row)} 
                                    onSquareChange={(value) => this.handleSquareChange(column, row, value)}
                                    onSquareSelection={() => this.handleSquareSelection(row, column)}
                                    isFillMode={this.props.isFillMode} 
                                    isSelected={curSquareIsSelected} />
            iter++;
          }
        }
        const key = '(' + y + ',' + x + ')';
        return (
          <Region key={key} squares={squares} />
        )
      }

      isSquareSelected(row, column) {
        if (this.state.selectedSquare == null) {
          return false;
        }
        return row === this.state.selectedSquare.y && column === this.state.selectedSquare.x;
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

      /**
       * Return all errors currently present in the board.
       * 
       * @return {Errors} 
       */
      getErrors() {
        let errors = new Errors();
        for (let y = 0; y < this.state.currentBoard.length; y++) {
          for (let x = 0; x < this.state.currentBoard[y].length; x++) {
            //errors from initial square shouldn't be 'primary' errors
            if (this.getInitialBoardValue(x, y)) {
              continue;
            }
            const currentSquareConflicts = this.getRowConflicts(x, y).concat(this.getColumnConflicts(x, y)).concat(this.getRegionConflicts(x, y));
            if (currentSquareConflicts.length > 0) {
              const error = new Error(x, y, currentSquareConflicts);
              errors.add(error);
            }
          }
        }
        return errors;
      }

      //TODO: The code to check rows and columns is super similar... See if the logic
      //can be combined somehow...
      getRowConflicts(x, y) {
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
          if (valueInRow === currentNumber) {
            errors.push(new Conflict(curX, y, true, false, false));
          }
        }
        return errors;
      }

      getColumnConflicts(x, y) {
        const currentNumber = this.getBoardValue(x, y);
        const errors = [];
        if (!currentNumber) {
          return errors;
        }
        for (let curY = 0; curY < 9; curY++) {
          if (curY === y) {
            continue;
          }
          const valueInColumn = this.getBoardValue(x, curY);
          if (valueInColumn === currentNumber) {
            errors.push(new Conflict(x, curY, false, true, false));
          }
        }
        return errors;
      }

      getRegionConflicts(x, y) {
        const currentNumber = this.getBoardValue(x, y);
        const errors = [];
        if (!currentNumber) {
          return errors;
        }
        
        //get the top-left coordinate of whichever region this square is in
        const rowOffset = y < 3 ? 0 : y < 6 ? 3 : 6;
        const columnOffset = x < 3 ? 0 : x < 6 ? 3 : 6;
        for (let row = rowOffset; row < rowOffset + 3; row++) {
          for (let column = columnOffset; column < columnOffset + 3; column++) {
            if (x === column && y === row) {
              continue;
            }
            
            const value = this.getBoardValue(column, row);
            if (value === currentNumber) {
              errors.push(new Conflict(column, row, false, false, true));
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

      /**
       * Sets the value of a square in the board.
       * 
       * @param {number} x The x-coordinate of the square to set
       * @param {number} y The y-coordinate of the square to set
       * @param {number} value The value to set the square to
       * @param {function} callback An optional function to call after the state has been updated
       */
      setBoardValue(x, y, value, callback) {
        const boardCopy = [];
        for (let row of this.state.currentBoard) {
          boardCopy.push(row.slice());
        }
        boardCopy[y][x] = value;
        this.setState({
          currentBoard: boardCopy
        }, callback);
      }

      /**
       * @param {number} x The x-coordinate of the changed square
       * @param {number} y The y-coordinate of the changed square
       * @param {number} value The value that the board coordinate was changed to.
       */
      handleSquareChange(x, y, value) {
        this.setBoardValue(x, y, value, () => {
          const errors = this.getErrors();  
          this.props.onErrors(errors.errors);
        });
      }

      handleSquareSelection(row, column) {
        this.setState({
          selectedSquare: {x: column, y: row}
        })
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

class Errors {
  constructor() {
    this.errors = [];
  }

  add(error) {
    this.errors.push(error)
  }

  hasError(x, y) {
    return this.getError(x, y) !== null;
  }

  getError(x, y) {
    for (let error of this.errors) {
      if (error.x === x && error.y === y) {
        return error;
      }
    }
    return null;
  }
}

export class Error {

  /**
   * @param {number} x The x-coordinate (column) of the error
   * @param {number} y The y-coordinate (row) of the error
   * @return {Array<Conflict>} conflicts All the squares this error has conflicts with.
   */
  constructor(x, y, conflicts) {
    this.x = x;
    this.y = y;
    this.conflicts = conflicts;
  }

  /**
   * Returns whether this error square has a conflict at the passed coordinates.
   * 
   * @param {number} row The row to check
   * @param {number} column The column to check
   * @return {boolean} True if this error has a conflict at the passed coordinates
   */
   hasConflict(row, column) {
     for (let conflict of this.conflicts) {
       if (conflict.x === row && conflict.y === column) {
         return true;
       }
     }
     return false;
   }
}

class Conflict {
  /**
   * 
   */
  constructor(x, y, row, column, region) {
    this.x = x;
    this.y = y;
    this.row = row;
    this.column = column;
    this.region = region;
  }
}

Board.propTypes = {
  /** True if the game is currenty in fill mode */
  isFillMode: React.PropTypes.bool,
  /** The error that the user clicked on */
  selectedError: React.PropTypes.instanceOf(Error)
};