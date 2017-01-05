import React from 'react';

class GameContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      showErrors: false
    }
  }

  shouldShowErrors(value) {
      this.setState({
        showErrors: value
      })
  }

  render() {
    return (
    <div className="game-container">
      <div className="game-header">
        Sudoku
      </div>
      <div className="play-container">
        <Board showErrors={this.state.showErrors}/>
        <ButtonPanel showErrors={() => this.shouldShowErrors(true)}/>
      </div>
    </div>
  );
  }
}

/*
 * Panel that holds buttons that control the settings of the game
 */
class ButtonPanel extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="button-panel">
        <div className="check-button" onClick={this.props.showErrors}>
          Check
        </div>
      </div>
    )
  }
}

/**
 *
 */
class Board extends React.Component {
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
        return {};
      }

      checkRegion(x, y) {
        return {};
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

/**
 * A single square in the Sudoku board.
 */
class Square extends React.Component {
  constructor() {
    super();
    this.state = {
      isSelected: false, /* Whether this is the square the user is currently changing */
      number: ''         /* The number in this square. */
    };
  }
  handleClick(isSelected) {
    this.setState({
      isSelected: isSelected
    })
  }
  handleChange(event) {
    const userInput = event.target.value;
    if (this.isValidInput(userInput)) {
      this.setState({
        number: userInput
      })
      this.props.onSquareChange(userInput);
    }
  }

  /** @return True if the passed input string is a valid input for a Sudoku square
              e.g. is an empty string or a 1 digit non-zero number */
  isValidInput(input) {
    return input === '' ||
    input && input.length === 1 && this.isNumeric(input) && input !== '0';
  }

 /** @return True if the passed string is a number. */
  isNumeric(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
  }

  render() {
    let inputField;
    const isInitialSquare = this.props.initialNumber !== '';
    if (this.state.isSelected && !this.props.initialNumber) {
      inputField = <input className="input-field"
                          value={this.state.number}
                          type="text"
                          onChange={(event) => this.handleChange(event)}
                          maxLength="1"
                          autoFocus/>
    }
    else {
      const number = isInitialSquare ? this.props.initialNumber : this.state.number;
      inputField = <div className="number-container"> {number} </div>;
    }

    return (
      <div className={"square" + (isInitialSquare ? " immutable-square" : "") + (this.props.hasError ? " primary-error-square" : "")}
           onClick={() => this.handleClick(true)}
           onBlur={() => this.handleClick(false)}>
        {inputField}
      </div>
    )
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
export default GameContainer;
