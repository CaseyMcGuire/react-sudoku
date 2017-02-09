import React from 'react';
import Board from '../Board/Board';
import ButtonPanel from '../ButtonPanel/ButtonPanel';
import './GameContainer.css';

export default class GameContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      showErrors: false,
      isFillMode: true
    }
  }

  shouldShowErrors(value) {
      this.setState({
        showErrors: value
      })
  }

  setMode(isFillMode) {
    this.setState({
      isFillMode: isFillMode
    });
  }

  render() {
    return (
    <div className="game-container">
      <div className="game-header">
        Sudoku
      </div>
      <div className="play-container">
        <Board showErrors={this.state.showErrors} isFillMode={this.state.isFillMode}/>
        <ButtonPanel showErrors={() => this.shouldShowErrors(true)} 
                     isFillMode={this.state.isFillMode}
                     handleModeChange={(isFillMode) => this.setMode(isFillMode)}
                     />
      </div>
    </div>
  );
  }
}