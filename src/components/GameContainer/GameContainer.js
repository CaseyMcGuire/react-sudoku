import React from 'react';
import BoardContainer from '../../containers/BoardContainer';
import './GameContainer.css';
import ControlsContainer from "../../containers/ControlsContainer";

export default class GameContainer extends React.Component {
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
          <div className="board-and-error-container">
            <BoardContainer />
            <ControlsContainer />
          </div>
        </div>
      </div>
    );
  }
}