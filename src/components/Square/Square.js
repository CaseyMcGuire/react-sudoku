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
      number: '',         /* The number in this square. */
      isCandidateSquare: false, /* Whether this square is currently in candidate square mode or not. */
      candidateSquares: Array(9).fill(false) /* Store the toggle state of this square if it was ever in candidate mode */
    };
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

/**
 *  Record the toggling of a candidate square
 * 
 * @param {number} i The number in the candidate square
 */
  handleCandidateSquareClick(i) {
    if (this.props.isFillMode) {
      return;
    }
    const index = i - 1;
    const candidateSquares = this.state.candidateSquares.slice();
    candidateSquares[index] = !candidateSquares[index];
    this.setState({
      candidateSquares: candidateSquares
    })
  }

  handleKeyPress(event) {
    const pressedKey = event.key;
    if (this.isValidInput(pressedKey)) {
      this.handleCandidateSquareClick(parseInt(pressedKey, 10));
    }
  }

/** @return True if any of this square's candidate squares have been selected. */
  hasAnyCandidateSquares() {
    return this.state.candidateSquares.reduce((acc, isSelected) => acc || isSelected)
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
      inputField = <SelectedMutableSquare number={this.state.number} 
                                          handleChange={(event) => this.handleChange(event)} />
    }
    else if (!this.state.number && (this.hasAnyCandidateSquares() || isCandidateMode)) {
      inputField = <CandidateSquare candidateSquares={this.state.candidateSquares}
                                    handleCandidateSquareClick={(i) => this.handleCandidateSquareClick(i)} />
    }
    else {
      inputField =  <UnselectedMutableSquare number={this.state.number} 
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
  /** Callback for when the value inside a square has been changed (can only happen in Fill Mode) */
  onSquareChange: React.PropTypes.func,
  /** Callback for when a square is selected */
  onSquareSelection: React.PropTypes.func,
  /** True if the current board mode is Fill Mode */
  isFillMode: React.PropTypes.bool,
  /** True if this square is the currently selected square (i.e. the last square the user clicked on) */
  isSelected: React.PropTypes.bool
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
  return (
    <input className="input-field"
           value={props.number}
           type="text"
           onChange={(event) => props.handleChange(event)}
           maxLength="1"
           autoFocus/>
  );
}

SelectedMutableSquare.propTypes = {
  /** The number in this square. */
  number: React.PropTypes.string,
  /** Callback when user changes number in square */
  handleChange: React.PropTypes.func
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
  number: React.PropTypes.number
};


class CandidateSquare extends React.Component {
  constructor() {
    super();
  }
  render() {
      //create an array of candidate squares filled with the numbers from 1 to 9. This will be the 3x3 grid
      let candidateSquares =  [...Array(9).keys()].map(i => <SingleCandidateSquare key={i} 
                                                                                   number={i + 1} 
                                                                                   isSelected={this.props.candidateSquares[i]} 
                                                                                   handleClick={() => this.props.handleCandidateSquareClick(i + 1)} />);
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