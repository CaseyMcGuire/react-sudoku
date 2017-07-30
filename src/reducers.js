import { combineReducers } from 'redux';
import { SQUARE_CHANGE, SQUARE_SELECTED, TOGGLE_PAUSE, SET_IS_FILL_MODE, CANDIDATE_SQUARE_CHANGE, ON_ERRORS, ON_ERROR_SELECTION } from './actions';
import { deepCopyArray } from './util/ArrayUtil';

function currentBoard(state = getInitialBoard(), action) {
  switch(action.type) {
    case SQUARE_CHANGE:
      const boardCopy = deepCopyArray(state);
      const row = action.change.y;
      const column = action.change.x;
      boardCopy[row][column] = action.change.value;
      return boardCopy;
  }
  return state;
}


function initialBoard(state = getInitialBoard(), action) {
  //this should never change
  return state;
}

function candidateBoard(state = getEmptyCandidateBoard(), action) {
  switch(action.type) {
    case CANDIDATE_SQUARE_CHANGE:
      const copy = deepCopyArray(state);
      const row = action.change.y;
      const column = action.change.x;
      const adjustedValue = action.change.value - 1;//minus one to account for 0-indexing of array
      copy[row][column][adjustedValue] = !copy[row][column][adjustedValue];
      return copy;
  }
  return state;
}

function isFillMode(state = true, action) {
  switch(action.type) {
    case SET_IS_FILL_MODE:
      return !state;
  }
  return state;
}

function isPaused(state = false, action) {
  switch(action.type) {
    case TOGGLE_PAUSE:
      return !state;
  }
  return state;
}

function selectedSquare(state = null, action) {
  switch(action.type) {
    case SQUARE_SELECTED:
      return action.selectedSquare
  }
  return state;
}

function errors(state = [], action) {
  switch(action.type) {
    case ON_ERRORS:
      return action.errors;
  }
  return state;
}


function selectedError(state = null, action) {
  switch(action.type) {
    case ON_ERROR_SELECTION:
      //if the user clicked on the same error they're already viewing, then
      //toggle off the error
      if (state !== null && state.equals(action.error)) {
        return null;
      }
      return action.error;
    case SQUARE_CHANGE:
      const selectedErrorSquareChanged = state !== null &&
                                         action.change.x === state.x &&
                                         action.change.y === state.y;
      if (selectedErrorSquareChanged) {
        return null;
      }
  }
  return state;
}

function getInitialBoard() {
  return [
    ["", "", "", "", "", "", "", "", ""],
    ["", "8", "9", "4", "1", "", "", "", ""],
    ["", "", "6", "7", "", "", "1", "9", "3"],
    ["2", "", "", "", "", "", "7", "", ""],
    ["3", "4", "", "6", "", "", "", "1", ""],
    ["", "", "", "9", "", "", "", "", "5"],
    ["", "", "", "", "2", "", "", "5", ""],
    ["6", "5", "", "", "4", "", "", "2", ""],
    ["7", "3", "", "1", "", "", "", "", ""]
  ]
}

/** @returns {Array<Array<boolean>>} Returns an empty  */
function getEmptyCandidateBoard() {
  const candidateBoard = Array(9).fill(null);
  for (let i = 0; i < candidateBoard.length; i++) {
    candidateBoard[i] = Array(9).fill(null);
    for (let j = 0; j < candidateBoard[i].length; j++) {
      candidateBoard[i][j] = Array(9).fill(false);
    }
  }
  return candidateBoard;
}

const sudokuApp = combineReducers({
  currentBoard,
  initialBoard,
  candidateBoard,
  isFillMode,
  isPaused,
  selectedSquare,
  errors,
  selectedError
});

export default sudokuApp;