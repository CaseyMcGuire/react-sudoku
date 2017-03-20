import React from 'react';
import './ErrorPanel.css';
import {Error} from '../Board/Board.js';

/**
 * Panel that displays current outstanding errors to the user.
 */
export default class ErrorPanel extends React.Component {
  constructor() {
    super();
  }

  render() {
    //fix this
    const errorDisplay = this.props.errors.map(error => <ErrorListing key={'(' + error.x + ',' + error.y + ')'}
                                                                      error={error}
                                                                      selectedError={this.props.selectedError}
                                                                      onErrorSelection={this.props.onErrorSelection}/> );

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
}

function ErrorListing(props) {
  let errorStyling;
  if (Object.is(props.selectedError, props.error)) {
    errorStyling = " selected-error-listing";
  }
  else {
    errorStyling = "";
  }
  return (
    <li className={"error-listing" + errorStyling} onClick={() => props.onErrorSelection(props.error)}>
      column: {props.error.x} row: {props.error.y}
    </li>
  );
}

ErrorPanel.propTypes = {
  /** An array of {Error} objects that represent each error present in the board */
  errors: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Error)),
  /** Callback that takes the error the user clicked on. */
  onErrorSelection: React.PropTypes.func,
  /** The error currently being displayed on the board */
  selectedError: React.PropTypes.instanceOf(Error)
};
