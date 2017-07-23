import { combineReducers } from 'redux';
import { SQUARE_CHANGE, SQUARE_SELECTED, TOGGLE_PAUSE, SET_IS_FILL_MODE, CANDIDATE_SQUARE_CHANGE } from './actions';

function currentBoard(state = getEmptyBoard(), action) {
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
      const adjustedValue = action.change.value - 1;
      copy[row][column][adjustedValue] = !copy[row][column][adjustedValue];
      return copy;
  }
  return state;
}

function deepCopyArray(array) {
  return array.map((value) => {
    if (value instanceof Array) {
      return deepCopyArray(value);
    } else {
      return value;
    }
  })
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
    case SQUARE_CHANGE:
      //TODO: implement me!
      return state;
  }
  return state;
}


function selectedError(state = null, action) {
  return state;
}

// (row, col)
function getEmptyBoard(initialBoard) {
  const board = Array(9).fill(null);
  for (let i = 0; i < board.length; i++) {
    board[i] = Array(9).fill(null);
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = "";
    }
  }
  return board;
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