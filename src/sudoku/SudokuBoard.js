import Conflict from './Conflict';
import Errors from './Errors';
import SudokuError from './SudokuError';
export default class SudokuBoard {

  /**
   *
   * @param {Array<Array<String>>} board
   * @param {Array<Array<String>>} initialBoard
   */
  constructor(board, initialBoard) {
    this.board = board;
    this.initialBoard = initialBoard;
  }

  /**
   * Return all errors currently present in the board.
   *
   * @return {Errors}
   */
  getErrors() {
    let errors = new Errors();
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board[y].length; x++) {
        //errors from initial square shouldn't be 'primary' errors
        if (this.getInitialBoardValue(x, y)) {
          continue;
        }
        const currentSquareConflicts = this.getRowConflicts(x, y).concat(this.getColumnConflicts(x, y)).concat(this.getRegionConflicts(x, y));
        if (currentSquareConflicts.length > 0) {
          const error = new SudokuError(x, y, currentSquareConflicts);
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
        errors.push(new Conflict(curX, y));
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
        errors.push(new Conflict(x, curY));
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
          errors.push(new Conflict(column, row));
        }
      }
    }
    return errors;
  }

  /** @return {boolean} True iff this sudoku puzzle is solved */
  isSolved() {
    //if there are any errors, then (obviously) the puzzle isn't solved
    const errors = this.getErrors();
    if (errors) {
      return false;
    }

    //if any square doesn't have an entry, then the puzzle can't be solved.
    for (let i = 0; i < this.board; i++) {
      for (let j = 0; j < this.board[i]; j++) {
        if (!this.board[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  getBoardValue(x, y) {
    return this.board[y][x];
  }

  getInitialBoardValue(x, y) {
    return this.initialBoard[y][x];
  }
}