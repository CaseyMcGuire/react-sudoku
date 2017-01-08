import React from 'react';
import Board from '../Board/Board';
import ButtonPanel from '../ButtonPanel/ButtonPanel';
import './GameContainer.css';

export default class GameContainer extends React.Component {
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