import { connect } from 'react-redux';
import Board from '../components/Board/Board';
import { setBoardValue, setSelectedSquare, togglePause, setCandidateBoardValue } from '../actions';

const mapStateToProps = (state) => {
  return {
    currentBoard: state.currentBoard,
    initialBoard: state.initialBoard,
    candidateBoard: state.candidateBoard,
    selectedSquare: state.selectedSquare,
    isPaused: state.isPaused,
    isFillMode: state.isFillMode
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSquareChange: (x, y, value) => {
      dispatch(setBoardValue({
        x: x,
        y: y,
        value: value
      }))
    },
    onSquareSelection: (row, column) => {
      dispatch(setSelectedSquare({
        row: row,
        column: column
      }))
    },
    togglePause: () => {
      dispatch(togglePause());
    },
    onCandidateSquareChange: (x, y, value) => {
      dispatch(setCandidateBoardValue({
        x: x,
        y: y,
        value: value
      }))
    }
  }
}

const BoardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);

export default BoardContainer;