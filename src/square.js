import React from 'react';
import './square.css';


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
    if (this.state.isSelected && !this.props.initialNumber) {
      inputField = <input className="input-field"
                          value={this.state.number}
                          type="text"
                          onChange={(event) => this.handleChange(event)}
                          maxLength="1"
                          autoFocus/>
    }
    else {
      const number = isInitialSquare ? this.props.initialNumber : this.state.number;
      inputField = <div className="number-container"> {number} </div>;
    }

    return (
      <div className={"square" + (isInitialSquare ? " immutable-square" : "") + (this.props.hasError ? " primary-error-square" : "")}
           onClick={() => this.handleClick(true)}
           onBlur={() => this.handleClick(false)}>
        {inputField}
      </div>
    )
  }
}