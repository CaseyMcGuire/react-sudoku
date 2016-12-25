import React from 'react';

class GameContainer extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
    <div className="game-container">
      <div className="game-header">
        Sudoku
      </div>
      <div className="play-container">
        <Board />
        <ButtonPanel />
      </div>
    </div>
  );
  }
}

class ButtonPanel extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="button-panel">
        <div className="check-button" onClick={() => window.alert("button clicked!")}>
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
        board: this.getEmptyBoard(getInitialBoard())
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
      *
      */
      getRegion(x, y) {
        const rowOffset = x === 0 ? 0 : x === 1 ? 3 : 6;
        const columnOffset = y === 0 ? 0 : y === 1 ? 3 : 6;
        const squares = Array(9).fill(null);
        let iter = 0;
        for (let i = rowOffset; i < rowOffset + 3 ; i++) {
          for (let j = columnOffset; j < columnOffset + 3; j++) {
            squares[iter] = this.state.board[i][j];
            iter++;
          }
        }
        const key = '(' + x + ',' + y + ')';
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
            const key = '(' + i + ',' + j + ')';
            board[i][j] = <Square key={key} initialNumber={initialBoard[i][j]} />
          }
        }
        return board;
      }
}



/**
  * A single 9x9 square in a Sudoku board.
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
    }
  }
  isValidInput(input) {
    return input === '' ||
    input && input.length === 1 && this.isNumeric(input);
  }
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
      <div className={"square" + (isInitialSquare ? " immutable-square" : "")}
           onClick={() => this.handleClick(true)}
           onBlur={() => this.handleClick(false)}>
        {inputField}
      </div>
    )
  }
}

//test
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

export default GameContainer;
