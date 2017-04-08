import React from 'react';
import PropTypes from 'prop-types';
import './Timer.css';

/**
 * A simple timer component that displays hours:minutes:second.
 */
export default class Timer extends React.Component {

  /** Number of milliseconds in a second. */
  static ONE_SECOND_IN_MS = 1000;

  constructor() {
    super();
    this.state = {
      /** Number of seconds the timer has been unpaused */
      secondsElapsed: 0,
      /** The formatted time that appears in the timer. */
      time: "00:00:00"
    };
  }

  componentDidMount() {
    let self = this;
    //update the time every second
    setInterval(() => {
      this.tick();
    }, Timer.ONE_SECOND_IN_MS);
  }

  tick() {
    if (this.props.isPaused) {
      return;
    }
    this.setState({
      secondsElapsed: this.state.secondsElapsed + 1
    }, this.updateTimer());
  }


  updateTimer() {
    let secondsLeft = this.state.secondsElapsed;
    let hours = Math.floor(secondsLeft / (60 * 60));
    secondsLeft = secondsLeft - (hours * 60 * 60);
    let minutes = Math.floor(secondsLeft / 60);
    secondsLeft = secondsLeft - (minutes * 60);

    let formattedHours = hours <= 9 ? "0" + hours : hours;
    let formattedMinutes = minutes <= 9 ? "0" + minutes : minutes;
    let formattedSeconds = secondsLeft <= 9 ? "0" + secondsLeft : secondsLeft;
    let formattedTime = formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
    this.setState({
      time: formattedTime
    });
  }

  render() {
    let playSymbol = this.props.isPaused ? "\u25B6" : "\u25AE\u25AE";
    return (
      <div className="timer-container">
        <div className="timer-play-button" onClick={() => this.props.togglePause()}>
          {playSymbol}
        </div>
        <div className="timer">
          {this.state.time}
        </div>
      </div>
    );
  }
}

Timer.propTypes = {
  /** Whether the timer is paused */
  isPaused: PropTypes.bool.isRequired,
  togglePause: PropTypes.func.isRequired
}