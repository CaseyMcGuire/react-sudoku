import React from 'react';
import './Square.css';


/**
 * A single square in the Sudoku board.
 */
export default class Square extends React.Component {
  constructor() {
    super();
    this.state = {
      isSelected: false, /* Whether this is the square the user is currently changing */
      number: ''         /* The number in this square. */
    };
  }
  handleClick(isSelected) {
    this.setState({
      isSelected: isSelected
    })
  }
  handleChange(event) {
    const userInput = event.target.value;
    if (this.isValidInput(userInput)) {
      this.setState({
        number: userInput
      })
      this.props.onSquareChange(userInput);
    }
  }

  /** @return True if the passed input string is a valid input for a Sudoku square
              e.g. is an empty string or a 1 digit non-zero number */
  isValidInput(input) {
    return input === '' ||
    input && input.length === 1 && this.isNumeric(input) && input !== '0';
  }

 /** @return True if the passed string is a number. */
  isNumeric(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
  }

  render() {
    let inputField;
    const isInitialSquare = this.props.initialNumber !== '';
    if (isInitialSquare) {
      inputField = <ImmutableSquare number={this.props.initialNumber} />
    }
    else if (this.state.isSelected && !this.props.initialNumber) {
      inputField = <SelectedMutableSquare number={this.state.number} handleChange={(event) => this.handleChange(event)} />
    }
    else {
      inputField = <UnselectedMutableSquare number={this.state.number} hasError={this.props.hasError} /> 
    }

    return (
      <div className="square"
           onClick={() => this.handleClick(true)}
           onBlur={() => this.handleClick(false)}>
        {inputField}
      </div>
    )
  }
}

function ImmutableSquare(props) {
  return (
    <div className="immutable-square">
      <div className="number-container">
        {props.number}
      </div>
    </div>
  );
}

function SelectedMutableSquare(props) {
  return (
    <input className="input-field"
           value={props.number}
           type="text"
           onChange={(event) => props.handleChange(event)}
           maxLength="1"
           autoFocus/>
  );
}

function UnselectedMutableSquare(props) {
  const errorStyle = props.hasError ? "primary-error-square" : "";
  return (
    <div className={errorStyle}>
      <div className="number-container">
        {props.number}
      </div>
    </div>
  );
}

//TODO
function CandidateSquare(props) {

}