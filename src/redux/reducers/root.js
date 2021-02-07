/** Root reducer for widget-store app. Combines sub-reducers. */

import { combineReducers } from 'redux';
import cart from './cart';
import user from './user';

export default combineReducers({
  cart,
  user,
});
