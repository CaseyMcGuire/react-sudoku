import React from 'react';
import './NumberInputPanel.css';

export default class NumberInputPanel extends React.Component {

	constructor() {
		super();
	}

	render() {
		return (
			<div className="number-input-panel-container">
				<div className="number-input-panel">
					{[...Array(9).keys()].map(i => <NumberButton key={i} number={i + 1} handleNumberButtonPressed={this.props.handleNumberButtonPressed}/>)}
				</div>
				<div className="square-mode-container">
          			<div className="single-mode-button-container"> 
            			<FillButton onClick={() => this.props.handleModeChange(true)} isFillMode={this.props.isFillMode} />
          			</div>
          			<div className="single-mode-button-container">
             			<CandidateButton onClick={() => this.props.handleModeChange(false)} isFillMode={this.props.isFillMode}/>
          			</div>
        		</div>
			</div>
		);
	}
}

function NumberButton(props) {
	return (
		<div className="number-input-button" onClick={() => props.handleNumberButtonPressed(props.number)}>{props.number}</div>
	);
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