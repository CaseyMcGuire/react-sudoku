import React from 'react';
import './NumberInputPanel.css';

export default function NumberInputPanel(props) {
  return (
    <div className="number-input-panel-container">
      <div className="number-input-panel">
        {[...Array(9).keys()].map(i => <NumberButton key={i} number={i + 1 + ''}
                                                     handleNumberButtonPressed={props.handleNumberButtonPressed}/>)}
        <ClearButton handleClearButtonPressed={props.handleNumberButtonPressed}/>
      </div>
      <div className="square-mode-container">
        <div className="single-mode-button-container">
          <FillButton onClick={() => props.setIsFillMode(true)} isFillMode={props.isFillMode}/>
        </div>
        <div className="single-mode-button-container">
          <CandidateButton onClick={() => props.setIsFillMode(false)} isFillMode={props.isFillMode}/>
        </div>
      </div>
    </div>
  );
}

function ClearButton(props) {
  return (
    <div className="number-input-panel-button clear-button"
         onClick={() => props.handleClearButtonPressed('')}>C</div>
  );
}

function NumberButton(props) {
  return (
    <div className="number-input-panel-button number-input-button"
         onClick={() => props.handleNumberButtonPressed(props.number)}>{props.number}</div>
  );
}

function FillButton(props) {
  const styleNames = "mode-button fill-mode-button" + (props.isFillMode ? " selected" : " not-selected");
  return (
    <div title="Fill Mode" className={styleNames} onClick={props.onClick}>
      1
    </div>
  );
}

function CandidateButton(props) {
  const styleNames = "mode-button candidate-mode-button" + (!props.isFillMode ? " selected" : " not-selected");
  return (
    <div title="Candidate Mode" className={styleNames} onClick={props.onClick}>
      <div className="candidate-square-mock-container">
        {[...Array(9).keys()].map(i => <div key={i} className="candidate-square-mock"></div>)}
      </div>
    </div>
  );
}