import React from 'react';
import './ButtonPanel.css';

/*
 * Panel that holds buttons that control the settings of the game.
 */
export default class ButtonPanel extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="button-panel">
        <div className="check-button" onClick={this.props.showErrors}>
          Check
        </div>
        <div className="square-type-container">
          
        </div>
      </div>
    )
  }
}