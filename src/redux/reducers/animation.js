import { TOGGLE_DIR } from '../actions/types';

const INIT_STATE = {
  // flip flop state - 0 or 1
  // allows animations to alternate left and right exits
  flipFlop: false,
};

function animation(state = INIT_STATE, action) {
  switch (action.type) {
    case TOGGLE_DIR: {
      return {
        ...state,
        flipFlop: !state.flipFlop,
      };
    }
    default: {
      return state;
    }
  }
}

export default animation;
