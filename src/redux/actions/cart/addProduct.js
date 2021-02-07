/** Add_Product action creator. */

import { ADD_PRODUCT } from '../types';

function addProduct(payload) {
  return { type: ADD_PRODUCT, payload };
}
export default addProduct;
