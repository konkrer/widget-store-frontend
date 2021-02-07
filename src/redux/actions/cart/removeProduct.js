/** Remove product action creator. */

import { REMOVE_PRODUCT } from '../types';

function removeProduct(id) {
  return { type: REMOVE_PRODUCT, payload: { id } };
}

export default removeProduct;
