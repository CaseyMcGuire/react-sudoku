import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import GameContainer from './components/GameContainer/GameContainer';
import './index.css';

import { createStore } from 'redux';
import sudokuApp from './reducers';

let store = createStore(sudokuApp);

ReactDOM.render(
  <Provider store={store}>
    <GameContainer />
  </Provider>,
  document.getElementById('root')
);
