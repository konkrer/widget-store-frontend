/** Increment product quantity action creator. */

import { INCREMENT_QUANTITY } from '../types';

function incrementQuantity(id) {
  return { type: INCREMENT_QUANTITY, payload: { id } };
}

export default incrementQuantity;
