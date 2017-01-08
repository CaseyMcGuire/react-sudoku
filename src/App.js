import React, { Component } from 'react';
import logo from './logo.svg';
import GameContainer from './components/game/GameContainer';

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
