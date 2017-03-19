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
        <div className="button-container check-button-container">
          <button className="check-button" title="Check your current solution for errors"
                  onClick={this.props.showErrors}>
            Check
          </button>
        </div>
        <div className="button-container square-mode-container">
          <div className="single-mode-button-container">
            <FillButton onClick={() => this.props.handleModeChange(true)} isFillMode={this.props.isFillMode}/>
          </div>
          <div className="single-mode-button-container">
            <CandidateButton onClick={() => this.props.handleModeChange(false)} isFillMode={this.props.isFillMode}/>
          </div>
        </div>
        <div className="button-container">
          <div className="gear-button">
            &#9881;
          </div>
        </div>
      </div>
    )
  }
}

function FillButton(props) {
  const styleNames = "mode-button fill-mode-button" + (props.isFillMode ? " selected" : "");
  return (
    <div title="Fill Mode" className={styleNames} onClick={props.onClick}>
      F
    </div>
  );
}

function CandidateButton(props) {
  const styleNames = "mode-button fill-mode-button" + (!props.isFillMode ? " selected" : "");
  return (
    <div title="Candidate Mode" className={styleNames} onClick={props.onClick}>
      C
    </div>
  );
}

ButtonPanel.propTypes = {
  /** Callback for when "Check" button is clicked. */
  showErrors: React.PropTypes.func,
  /** Whether the game is currently in fill mode or not. */
  isFillMode: React.PropTypes.bool,
  /** Callback to handle when the game's current mode is changed. */
  handleModeChange: React.PropTypes.func
};