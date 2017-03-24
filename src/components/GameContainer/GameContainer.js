import React from 'react';
import Board from '../Board/Board';
import ErrorPanel from '../ErrorPanel/ErrorPanel';
import NumberInputPanel from '../NumberInputPanel/NumberInputPanel';
import './GameContainer.css';
import {ValidInputEnum} from '../NumberInputPanel/NumberInputPanel';
import Timer from '../Timer/Timer.js';

export default class GameContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      isFillMode: true,
      errors: [],
      selectedError: null,  //{Error}
      lastSelectedNumber: ValidInputEnum.NOTHING //The last selected number from input panel
    }
  }

  setMode(isFillMode) {
    this.setState({
      isFillMode: isFillMode
    });
  }

  setErrors(errors) {
    this.setState({
      errors: errors
    });
  }

  /**
   * @param {Error}
   */
  setSelectedError(error) {
    this.setState({
      selectedError: error
    })
  }

  handleErrorSelection(error) {
    if (Object.is(error, this.state.selectedError)) {
      this.setSelectedError(null);
    }
    else {
      this.setSelectedError(error);
    }
  }

  setLastSelectedNumber(number) {
    this.setState({
      lastSelectedNumber: number
    });
  }

  handleSquareSelection() {
    //after a new square is selected, set the last selected number to null
    //so we don't end up passing a stale number down to the new square
    this.setLastSelectedNumber(ValidInputEnum.NOTHING);
  }


  render() {
    return (
      <div className="game-container">
        <div className="game-header">
          Sudoku
        </div>
        <div className="play-container">
          <div className="board-and-error-container">
            <Board selectedError={this.state.selectedError}
                   isFillMode={this.state.isFillMode}
                   onErrors={(errors) => this.setErrors(errors)}
                   lastSelectedNumber={this.state.lastSelectedNumber}
                   handleSquareSelection={() => this.handleSquareSelection()}/>
            <div className="error-panel-and-number-input-panel">
              <ErrorPanel errors={this.state.errors}
                          selectedError={this.state.selectedError}
                          onErrorSelection={(error) => this.handleErrorSelection(error)}/>
              <Timer />
              <NumberInputPanel handleModeChange={(isFillMode) => this.setMode(isFillMode)}
                                isFillMode={this.state.isFillMode}
                                handleNumberButtonPressed={(number) => this.setLastSelectedNumber(number)}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}