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
    const errorDisplay = this.props.errors.map(i => <li key={'(' + i.x + ',' + i.y + ')'}
                                                        onClick={() => this.props.onErrorSelection(i)}>column: {i.x} row: {i.y}</li>)
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
        <button className="clear-error-button" onClick={() => this.props.onErrorSelection(null)}>Clear</button>
      </div>
    );
  }
}

ErrorPanel.propTypes = {
  /** An array of {Error} objects that represent each error present in the board */
  errors: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Error)),
  /** Callback that takes the error the user clicked on. */
  onErrorSelection: React.PropTypes.func
};
