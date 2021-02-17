/** Cart reducer. Reset, upload data to store, change quantity. */

import {
  RESET_CART,
  ADD_PRODUCT,
  INCREMENT_QUANTITY,
  DECREMENT_QUANTITY,
  REMOVE_PRODUCT,
  SHED_EMPTY,
} from '../actions/types';
import { calculateSubtotal } from '../../utils/moneyFuncts';

const INITIAL_STATE = {
  items: {},
  subtotal: 0,
  numCartItems: 0,
};

function cart(state = INITIAL_STATE, action) {
  let items, subtotal, numCartItems;

  switch (action.type) {
    case RESET_CART:
      return { ...INITIAL_STATE };

    case ADD_PRODUCT:
      // called by add to cart button.
      // check if product is already in cart.
      const inCart = state.items[action.payload.product_id];
      // add new quantity to the old quantity if old quantity
      const newQuantity = inCart
        ? action.payload.quantity + inCart.quantity
        : action.payload.quantity;
      items = {
        ...state.items,
        [action.payload.product_id]: {
          ...action.payload,
          quantity: newQuantity,
        },
      };
      subtotal = calculateSubtotal(items);
      numCartItems = getNumCartItems(items);
      return { ...state, items, subtotal, numCartItems };

    case INCREMENT_QUANTITY:
      // called by cart quantity increment button
      items = {
        ...state.items,
        [action.payload.id]: {
          ...state.items[action.payload.id],
          quantity: state.items[action.payload.id].quantity + 1,
        },
      };
      subtotal = calculateSubtotal(items);
      numCartItems = getNumCartItems(items);
      return { ...state, items, subtotal, numCartItems };

    case DECREMENT_QUANTITY:
      // if zero return state
      if (state.items[action.payload.id].quantity === 0) {
        return state;
      }
      // called by cart quantity decrement button
      items = {
        ...state.items,
        [action.payload.id]: {
          ...state.items[action.payload.id],
          quantity: state.items[action.payload.id].quantity - 1,
        },
      };
      subtotal = calculateSubtotal(items);
      numCartItems = getNumCartItems(items);
      return { ...state, items, subtotal, numCartItems };

    case REMOVE_PRODUCT:
      items = { ...state.items };
      delete items[action.payload.id];
      subtotal = calculateSubtotal(items);
      numCartItems = getNumCartItems(items);
      return { ...state, items, subtotal, numCartItems };

    case SHED_EMPTY:
      // remove zero quantity items from items obj
      const copy = { ...state.items };
      Object.entries(copy).forEach(([key, { quantity }]) => {
        if (quantity === 0) delete copy[key];
      });

      return { ...state, items: copy };

    default:
      return state;
  }
}

function getNumCartItems(items) {
  return Object.values(items).reduce(
    (acc, product) => acc + product.quantity,
    0
  );
}

export default cart;
