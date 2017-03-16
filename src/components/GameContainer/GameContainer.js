import React from 'react';
import Board from '../Board/Board';
import ButtonPanel from '../ButtonPanel/ButtonPanel';
import ErrorPanel from '../ErrorPanel/ErrorPanel';
import NumberInputPanel from '../NumberInputPanel/NumberInputPanel';
import './GameContainer.css';

export default class GameContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      isFillMode: true,
      errors: [],
      selectedError: null,  //{Error}
      lastSelectedNumber: null //The last selected number from input
    }
  }

  shouldShowErrors(value) {
      this.setState({
        showErrors: value
      });
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

  setLastSelectedNumber(number) {
    this.setState({
      lastSelectedNumber: number
    });
  }

  handleSquareSquareSelection() {
    //after a new square is selected, set the last selected number to null
    //so we don't end up passing a stale number down to the new square
    this.setLastSelectedNumber(null);
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
                 handleSquareSelection={() => this.handleSquareSquareSelection()}/>
          <div className="error-panel-and-number-input-panel">
            <ErrorPanel errors={this.state.errors} onErrorSelection={(error) => this.setSelectedError(error)}/>
            <NumberInputPanel handleModeChange={(isFillMode) => this.setMode(isFillMode)} 
                              isFillMode={this.state.isFillMode}
                              handleNumberButtonPressed={(number) => this.setLastSelectedNumber(number)} />
          </div>
        </div>
        {/*<ButtonPanel showErrors={() => this.shouldShowErrors(true)} 
                       isFillMode={this.state.isFillMode}
                       handleModeChange={(isFillMode) => this.setMode(isFillMode)}
        />*/}
      </div>
    </div>
  );
  }
}