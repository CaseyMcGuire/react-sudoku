import { connect } from 'react-redux';
import Controls from "../components/Controls/Controls";
import { setIsFillMode, onErrorSelection, setBoardValue, togglePause } from '../actions';

const mapStateToProps = (state) => {
  return {
    errors: state.errors,
    selectedError: state.selectedError,
    isPaused: state.isPaused,
    isFillMode: state.isFillMode,
    selectedSquare: state.selectedSquare
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onNumberButtonInput: (x, y, value) => {
      dispatch(setBoardValue({
        x: x,
        y: y,
        value: value
      }))
    },
    onErrorSelection: (error) => {
      dispatch(onErrorSelection(error));
    },
    setIsFillMode: (isFillMode) => {
      dispatch(setIsFillMode(isFillMode));
    },
    togglePause: () => {
      dispatch(togglePause());
    }
  };
}

const ControlsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Controls);

export default ControlsContainer;