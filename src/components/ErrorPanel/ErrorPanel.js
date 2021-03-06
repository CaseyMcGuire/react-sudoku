import React from 'react';
import PropTypes from 'prop-types';
import './ErrorPanel.css';
import SudokuError from '../../sudoku/SudokuError';

/**
 * Panel that displays current outstanding errors to the user.
 */
export default function ErrorPanel(props) {
  //fix this
  const errorDisplay = props.errors.map(error => <ErrorListing key={'(' + error.x + ',' + error.y + ')'}
                                                               error={error}
                                                               selectedError={props.selectedError}
                                                               onErrorSelection={props.onErrorSelection}/> );

  return (
    <div className="error-panel">
      <div className="error-panel-header">
        <span className="error-title">Errors</span>
      </div>
      <div className="error-list-container">
        <ul className="error-list">
          {errorDisplay}
        </ul>
      </div>
    </div>
  );
}


function ErrorListing({ selectedError, error, onErrorSelection }) {
  let errorStyling;
  if (Object.is(selectedError, error)) {
    errorStyling = " selected-error-listing";
  }
  else {
    errorStyling = "";
  }
  return (
    <li className={"error-listing" + errorStyling} onClick={() => onErrorSelection(error)}>
      column: {error.x} row: {error.y}
    </li>
  );
}

ErrorPanel.propTypes = {
  /** An array of {Error} objects that represent each error present in the board */
  errors: PropTypes.arrayOf(PropTypes.instanceOf(SudokuError)),
  /** Callback that takes the error the user clicked on. */
  onErrorSelection: PropTypes.func,
  /** The error currently being displayed on the board */
  selectedError: PropTypes.instanceOf(SudokuError)
};
