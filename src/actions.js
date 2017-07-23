export const SQUARE_CHANGE = 'SQUARE_CHANGE';
export const CANDIDATE_SQUARE_CHANGE = 'CANDIDATE_SQUARE_CHANGE';
export const SQUARE_SELECTED = 'SQUARE_SELECTED';
export const TOGGLE_PAUSE = 'TOGGLE_PAUSE';
export const SET_IS_FILL_MODE = 'SET_IS_FILL_MODE';
export const ON_ERROR_SELECTION = 'ON_ERROR_SELECTION';

export function setBoardValue(change) {
  return {
    type: SQUARE_CHANGE,
    change
  }
}

export function setSelectedSquare(selectedSquare) {
  return {
    type: SQUARE_SELECTED,
    selectedSquare
  }
}

export function togglePause() {
  return {
    type: TOGGLE_PAUSE
  }
}

export function setIsFillMode(isFillMode) {
  return {
    type: SET_IS_FILL_MODE,
    isFillMode
  }
}

export function onErrorSelection(error) {
  return {
    type: ON_ERROR_SELECTION,
    error
  }
}

export function setCandidateBoardValue(change) {
  return {
    type: CANDIDATE_SQUARE_CHANGE,
    change
  }
}