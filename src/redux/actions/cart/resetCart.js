/** Reset action creator. */

import { RESET_CART } from '../types';

function resetCart() {
  return { type: RESET_CART };
}

export default resetCart;
