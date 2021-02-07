/** Log user in action creator. */

import { LOG_IN } from '../types';

function login(user, token) {
  return { type: LOG_IN, payload: { user, token } };
}

export default login;
