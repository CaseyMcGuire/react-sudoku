import React from 'react';
import ErrorPanel from "../ErrorPanel/ErrorPanel";
import Timer from "../Timer/Timer";
import NumberInputPanel from "../NumberInputPanel/NumberInputPanel";
import './Controls.css';

export default class Controls extends React.Component {

  constructor() {
    super();
  }

  handleNumberButtonPressed(number) {
    if (this.props.selectedSquare === null) {
      return;
    }
    const row = this.props.selectedSquare.row;
    const column = this.props.selectedSquare.column;
    this.props.onNumberButtonInput(column, row, number);
  }

  render() {
    return (
      <div className="control-panel">
        <ErrorPanel errors={this.props.errors}
                    selectedError={this.props.selectedError}
                    onErrorSelection={(error) => this.props.onErrorSelection(error)}/>
        <Timer isPaused={this.props.isPaused}
               togglePause={() => this.props.togglePause()} />
        <NumberInputPanel setIsFillMode={(isFillMode) => this.props.setIsFillMode(isFillMode)}
                          isFillMode={this.props.isFillMode}
                          handleNumberButtonPressed={(number) => this.handleNumberButtonPressed(number)}/>
      </div>
    );
  }
}