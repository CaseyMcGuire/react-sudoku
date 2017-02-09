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
      candidateSquares: Array(9).fill(false)
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

/**
 *  Record the toggling of a candidate square
 * 
 * @param {number} The index of the candidate square that was clicked (off by one such that if 1 was toggled, the index would be 0)
 */
  handleCandidateSquareClick(i) {
    if (this.props.isFillMode) {
      return;
    }
    const candidateSquares = this.state.candidateSquares.slice();
    candidateSquares[i] = !candidateSquares[i];
    this.setState({
      candidateSquares: candidateSquares
    })
  }

  hasAnyCandidateSquares() {
    return this.state.candidateSquares.reduce((acc, isSelected) => acc || isSelected)
  }

  render() {
    let inputField;
    const isInitialSquare = this.props.initialNumber !== '';
    const isCandidateMode = !this.props.isFillMode;
    if (isInitialSquare) {
      inputField = <ImmutableSquare number={this.props.initialNumber} />
    }
    else if (this.state.isSelected && this.props.isFillMode) {
      inputField = <SelectedMutableSquare number={this.state.number} 
                                          handleChange={(event) => this.handleChange(event)} />
    }
    else if (!this.state.number && (this.hasAnyCandidateSquares() || isCandidateMode)) {
      inputField = <CandidateSquare candidateSquares={this.state.candidateSquares}
                                    handleCandidateSquareClick={(i) => this.handleCandidateSquareClick(i)} />
    }
    else {
      inputField =  <UnselectedMutableSquare number={this.state.number} 
                                             hasError={this.props.hasError} /> 
    }

    return (
      <div className="square sudoku-square"
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

class CandidateSquare extends React.Component {
  constructor() {
    super();
  }
  render() {
      //create an array of candidate squares filled with the numbers from 1 to 9. This will be the 3x3 grid
      let candidateSquares =  [...Array(9).keys()].map(i => <SingleCandidateSquare key={i} 
                                                                                   number={i + 1} 
                                                                                   isSelected={this.props.candidateSquares[i]} 
                                                                                   handleClick={() => this.props.handleCandidateSquareClick(i)} />);
      return (
        <div className="candidate-squares-container">
          {candidateSquares}
         </div>
      );
    }
}

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