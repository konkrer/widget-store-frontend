/** Decrement product quantity action creator. */

import { DECREMENT_QUANTITY } from '../types';

function decrementQuantity(id) {
  return { type: DECREMENT_QUANTITY, payload: { id } };
}

export default decrementQuantity;
