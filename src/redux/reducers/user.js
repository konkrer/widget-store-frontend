/** User reducer. */

import { LOG_OUT, LOG_IN } from '../actions/types';

const INIT_STATE = {
  user: null,
  token: null,
};

function user(state = INIT_STATE, action) {
  switch (action.type) {
    case LOG_OUT:
      return { ...INIT_STATE };

    case LOG_IN:
      return {
        ...state,
        user: { ...action.payload.user },
        token: action.payload.token,
      };

    default:
      return state;
  }
}

export default user;
