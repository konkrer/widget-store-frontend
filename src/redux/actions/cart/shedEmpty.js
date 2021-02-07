/** Shed Empty action creator.
 *
 * Remove items from cart that have zero quantity.
 */

import { SHED_EMPTY } from '../types';

const shedEmpty = () => {
  return { type: SHED_EMPTY };
};

export default shedEmpty;
