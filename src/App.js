import React, { Component } from 'react';
import logo from './logo.svg';
//import './App.css';
import GameContainer from './GameContainer';

/**
 * Main entry point for the app.
 */
class App extends Component {
    render() {
        return (
          <div>
            <GameContainer />
          </div>
        );
    }
}

export default App;
