import React from 'react';
import './Square.css';


/**
 * A single square in the Sudoku board.
 */
export default class Square extends React.Component {
  constructor() {
    super();
  }

  /**
   * @param event {SyntheticEvent} The event that is fired when the Fill-mode input field is changed.
   */
  handleInputFieldChange(event) {
    const userInput = event.target.value;
    if (this.isValidInput(userInput)) {
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

  /**
   *  Record the toggling of a candidate square
   *
   * @param {number} i The number in the candidate square
   */
  handleCandidateSquareClick(i) {
    this.props.onSquareChange(i);
  }

  handleKeyPress(event) {
    const pressedKey = event.key;
    if (this.isValidInput(pressedKey)) {
      this.props.onSquareChange(pressedKey);
    }
  }

  /** @return True if any of this square's candidate squares have been selected. */
  hasAnyCandidateSquares() {
    return this.props.candidateSquares.reduce((acc, isSelected) => acc || isSelected)
  }

  /** @return {boolean} True if this square was one of the filled-in squares the game started with. */
  isInitialSquare() {
    return this.props.initialNumber !== '';
  }

  handleClick() {
    //don't allow initials square to be selected
    if (this.isInitialSquare()) {
      return;
    }
    this.props.onSquareSelection();
  }

  render() {
    let inputField;
    const isInitialSquare = this.isInitialSquare();
    const isCandidateMode = !this.props.isFillMode;
    if (isInitialSquare) {
      inputField = <ImmutableSquare number={this.props.initialNumber}
                                    isConflict={this.props.isConflict}/>
    }
    else if (this.props.isSelected && this.props.isFillMode) {
      inputField = <SelectedMutableSquare number={this.props.currentNumber}
                                          isError={this.props.isError}
                                          isConflict={this.props.isConflict}
                                          handleInputFieldChange={(event) => this.handleInputFieldChange(event)}/>
    }
    else if (!this.props.currentNumber && (this.hasAnyCandidateSquares() || isCandidateMode)) {
      inputField = <CandidateSquare candidateSquares={this.props.candidateSquares}
                                    handleCandidateSquareClick={(i) => this.handleCandidateSquareClick(i)}/>
    }
    else {
      inputField = <UnselectedMutableSquare number={this.props.currentNumber}
                                            isError={this.props.isError}
                                            isConflict={this.props.isConflict}/>
    }

    const selectedStyle = this.props.isSelected ? " selected" : "";
    return (
      <div className={"square sudoku-square" + selectedStyle}
           tabIndex="-1"
           onKeyPress={(event) => this.handleKeyPress(event)}
           onClick={() => this.handleClick() }>
        {inputField}
      </div>
    )
  }
}

Square.propTypes = {
  /** True if this square is the 'primary' error square */
  isError: React.PropTypes.bool,
  /** True if this square is in conflict with the 'primary' error square */
  isConflict: React.PropTypes.bool,
  /** The value that was in this square at the beginning of the game. Null if this square was empty.*/
  initialNumber: React.PropTypes.string,
  /** The value currently in this square. Null if there isn't a value in this square. */
  currentNumber: React.PropTypes.string,
  /** Callback for when the value inside a square has been changed */
  onSquareChange: React.PropTypes.func,
  /** Callback for when a square is selected */
  onSquareSelection: React.PropTypes.func,
  /** True if the current board mode is Fill Mode */
  isFillMode: React.PropTypes.bool,
  /** True if this square is the currently selected square (i.e. the last square the user clicked on) */
  isSelected: React.PropTypes.bool,
  /** The toggle state of the 9 possible candidates */
  candidateSquares: React.PropTypes.arrayOf(React.PropTypes.bool)
};

/******************************************
 * SPECIFIC SQUARE TYPES
 ******************************************/

function ImmutableSquare(props) {
  let errorStyle;
  if (props.isConflict) {
    errorStyle = " immutable-secondary-error";
  }
  else {
    errorStyle = "";
  }
  return (
    <div className={"immutable-square" + errorStyle}>
      <div className="number-container">
        {props.number}
      </div>
    </div>
  );
}

ImmutableSquare.propTypes = {
  /** The number in this square */
  number: React.PropTypes.string,
  /** True iff this square is in conflict with the error square. */
  isConflict: React.PropTypes.bool
};

function SelectedMutableSquare(props) {
  let errorStyle;
  if (props.isError) {
    errorStyle = " error";
  }
  else if (props.isConflict) {
    errorStyle = " conflict";
  }
  else {
    errorStyle = "";
  }
  return (
    <div className={"input-field-container" + errorStyle}>
      <input className="input-field"
             value={props.number}
             type="text"
             onChange={(event) => props.handleInputFieldChange(event)}
             maxLength="1"
             autoFocus/>
    </div>
  );
}

SelectedMutableSquare.propTypes = {
  /** The number in this square. */
  number: React.PropTypes.string,
  /** Callback when user changes number in square */
  handleChange: React.PropTypes.func,
  /** True if this square is conficting with the selected error square */
  isError: React.PropTypes.bool,
  /** True iff this square is in conflict with the error square. */
  isConflict: React.PropTypes.bool
};

function UnselectedMutableSquare(props) {
  let errorStyle;
  if (props.isError) {
    errorStyle = "primary-error-square";
  }
  else if (props.isConflict) {
    errorStyle = "secondary-error-square";
  }
  else {
    errorStyle = "";
  }
  return (
    <div className={errorStyle}>
      <div className="number-container">
        {props.number}
      </div>
    </div>
  );
}

UnselectedMutableSquare.propTypes = {
  /** True if this square is the selected error */
  isError: React.PropTypes.bool,
  /** True if this square is conflicting with the selected error */
  isConflict: React.PropTypes.bool,
  /** The number in this square */
  number: React.PropTypes.string
};


class CandidateSquare extends React.Component {
  constructor() {
    super();
  }

  render() {
    //create an array of candidate squares filled with the numbers from 1 to 9. This will be the 3x3 grid
    let candidateSquares = [...Array(9).keys()].map(i => <SingleCandidateSquare key={i}
                                                                                number={i + 1}
                                                                                isSelected={this.props.candidateSquares[i]}
                                                                                handleClick={() => this.props.handleCandidateSquareClick(i + 1)}/>);
    return (
      <div className="candidate-squares-container">
        {candidateSquares}
      </div>
    );
  }
}

CandidateSquare.propTypes = {
  /** An array describing which of the candidate squares has been toggled */
  candidateSquares: React.PropTypes.arrayOf(React.PropTypes.bool),
  /** Callback when a single candidate square is clicked. */
  handleCandidateSquareClick: React.PropTypes.func
};

class SingleCandidateSquare extends React.Component {
  constructor() {
    super();
  }

  render() {
    //if this square isn't selected, we don't want to show anything
    const number = this.props.isSelected ? this.props.number : '';
    return (
      <div className="square single-candidate-square" onClick={() => this.props.handleClick() }>
        {number}
      </div>
    );
  }
}

SingleCandidateSquare.propTypes = {
  /** This candidate square's number */
  number: React.PropTypes.number,
  /** True if this square has been toggled (i.e. whether it should be displayed) */
  isSelected: React.PropTypes.bool,
  /** Callback for when this square is clicked */
  handleClick: React.PropTypes.func
};