import React from 'react';
import PropTypes from 'prop-types';
import Square from '../Square/Square.js';
import './Board.css';
import SudokuBoard from '../../sudoku/SudokuBoard';
import SudokuError from '../../sudoku/SudokuError';

/**
 * The actual 9x9 sudoku game board
 */
export default class Board extends React.Component {

  constructor() {
    super();
  }

  componentWillReceiveProps(nextProps) {
    //Hmmm... not sure about this. Should this go in the redux store?
    const newBoard = new SudokuBoard(nextProps.currentBoard, nextProps.initialBoard);
    const oldBoard = new SudokuBoard(this.props.currentBoard, this.props.initialBoard);

    const oldErrors = oldBoard.getErrors();
    const newErrors = newBoard.getErrors();
    if (!oldErrors.equals(newErrors)) {
      this.props.onErrors(newErrors.errors);
    }
  }

  render() {
    const regions = this.getRegions();
    const firstRow = regions.slice(0, 3);
    const secondRow = regions.slice(3, 6);
    const thirdRow = regions.slice(6, 9);

    return (
      <div className="board-container">
        {this.props.isPaused ? <PausePanel togglePause={this.props.togglePause}/> : ''}
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
    for (let row = rowOffset; row < rowOffset + 3; row++) {
      for (let column = columnOffset; column < columnOffset + 3; column++) {
        const key = '(' + column + ',' + row + ')';
        const error = this.props.selectedError;
        const isError = this.props.selectedError == null ? false : error.x === column && error.y === row;

        const curSquareIsSelected = this.isSquareSelected(row, column);
        const isConflict = this.props.selectedError == null ? false : this.props.selectedError.hasConflict(column, row);
        squares[iter] = <Square key={key}
                                isError={isError}
                                isConflict={isConflict}
                                initialNumber={this.getInitialBoardValue(column, row)}
                                currentNumber={this.getBoardValue(column, row)}
                                candidateSquares={this.getCandidateForSquare(column, row)}
                                onSquareChange={(value) => this.handleSquareChange(column, row, value)}
                                onSquareSelection={() => this.handleSquareSelection(row, column)}
                                isFillMode={this.props.isFillMode}
                                isSelected={curSquareIsSelected}/>
        iter++;
      }
    }
    const key = '(' + y + ',' + x + ')';
    return (
      <Region key={key} squares={squares}/>
    )
  }

  isSquareSelected(row, column) {
    if (this.props.selectedSquare === null) {
      return false;
    }
    return row === this.props.selectedSquare.row && column === this.props.selectedSquare.column;
  }

  /**
   * Get the the 9-element array describing the toggle state of each candidate square for
   * this particular square.
   *
   * @param x {number} The x-coordinate of the square
   * @param y {number} The y-coordinate of the square
   * @returns {Array<Boolean>} The 9-element array representing the toggle state of the given candidate square
   */
  getCandidateForSquare(x, y) {
    return this.props.candidateBoard[y][x];
  }

  getInitialBoardValue(x, y) {
    return this.props.initialBoard[y][x];
  }

  getBoardValue(x, y) {
    return this.props.currentBoard[y][x];
  }

  /**
   * @param {number} x The x-coordinate of the changed square
   * @param {number} y The y-coordinate of the changed square
   * @param {number | string} value The value that the board coordinate was changed to.
   */
  handleSquareChange(x, y, value) {
    if (this.props.isFillMode) {
      this.props.onSquareChange(x, y, value);
    } else {
      this.props.onCandidateSquareChange(x, y, value);
    }
  }

  handleSquareSelection(row, column) {
    this.props.onSquareSelection(row, column);
  }
}

/** @returns {XML} The panel that overlays the board when the game is paused.*/
function PausePanel({togglePause}) {
  return (
    <div className="pause-panel">
      <div className="pause-text-container">
        <div className="pause-panel-text"> Paused </div>
        <button onClick={togglePause} className="resume-button">Resume</button>
      </div>
    </div>
  );
}

PausePanel.propTypes = {
  /** Callback for when 'resume' button is pressed */
  togglePause: PropTypes.func.isRequired
};

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

//Have to put this down here since the Error class apparently isn't in scope yet.
Board.propTypes = {
  /** True if the game is currenty in fill mode */
  isFillMode: PropTypes.bool.isRequired,
  /** The error that the user clicked on */
  selectedError: PropTypes.instanceOf(SudokuError),
  onErrors: PropTypes.func.isRequired,
  lastSelectedNumber: PropTypes.number,
  /** Whether the game is paused or not. */
  isPaused: PropTypes.bool.isRequired,
  /** Callback for when 'Resume' button on pause panel is pressed */
  togglePause: PropTypes.func.isRequired
};