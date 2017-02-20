import React from 'react';
import Board from '../Board/Board';
import ButtonPanel from '../ButtonPanel/ButtonPanel';
import ErrorPanel from '../ErrorPanel/ErrorPanel'
import './GameContainer.css';

export default class GameContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      showErrors: false,
      isFillMode: true,
      errors: [],
      selectedError: null  //{Error}
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

  render() {
    return (
    <div className="game-container">
      <div className="game-header">
        Sudoku
      </div>
      <div className="play-container">
        <div className="board-and-error-container">
          <Board showErrors={this.state.showErrors}
                 selectedError={this.state.selectedError} 
                 isFillMode={this.state.isFillMode} 
                 onErrors={(errors) => this.setErrors(errors)}  />
          <ErrorPanel errors={this.state.errors} onErrorSelection={(error) => this.setSelectedError(error)}/>
        </div>
        <ButtonPanel showErrors={() => this.shouldShowErrors(true)}
                     isFillMode={this.state.isFillMode}
                     handleModeChange={(isFillMode) => this.setMode(isFillMode)}
                     />
      </div>
    </div>
  );
  }
}