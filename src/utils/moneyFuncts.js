/** Functions for basic money calculations for widget-store. */

import Decimal from 'decimal.js';

/* SF sales tax. */
const SF_SALES_TAX = '0.085';

/** calculateDiscountPrice()
 *
 * Calculate discounted price from product object.
 * Product object should have properties "price"
 * and "discount".
 * @param {object} product
 *
 * returns: string
 */

export function calculateDiscountPrice(product) {
  if (product.discount === '0.00') return product.price;
  const price = new Decimal(product.price);
  return price.minus(price.times(product.discount)).toFixed(2);
}

/** calculateSubtotal()
 *
 * Calculate items subtotal from cart.items object.
 * Each cart item should have properties "price", "discount",
 * and "quantity" of items ordered.
 *
 * @param {object} items {product_id: item, product_id: item}
 *
 * returns: string
 */

export function calculateSubtotal(items) {
  return Object.values(items)
    .reduce((acc, product) => {
      const price = new Decimal(calculateDiscountPrice(product));
      const itemTotal = price.times(product.quantity);
      return itemTotal.plus(acc);
    }, 0)
    .toFixed(2);
}

/** calculateDiscountPercent()
 *
 * Calculate discount as an integer percent from
 * product object.discount.
 *
 * E.g. 0.15 --> 15
 *
 * returns: string
 */

export function calculateDiscountPercent(product) {
  const discount = new Decimal(product.discount);
  return discount.times(100).toFixed(0);
}

/** getDiscountData()
 *
 * Return discounted price and discount as a percent
 * from product obj.
 * @param {object} product
 *
 * returns { discountPrice, percent }
 */

export function getDiscountData(product) {
  return {
    discountPrice: calculateDiscountPrice(product),
    percent: calculateDiscountPercent(product),
  };
}

/** calculateTax()
 *
 * Calculate tax if customer is in California.
 * @param {string} subtotal
 * @param {string} state
 *
 * returns: string
 */

export function calculateTax(subtotal, state) {
  if (!/^ca(lifornia)?$/i.test(state)) return '0.00';
  subtotal = new Decimal(subtotal);
  return subtotal.times(SF_SALES_TAX).toFixed(2);
}

/** calculateTotal()
 *
 * Calculate subtotal plus tax, plus shipping cost if provided.
 * @param {string} subtotal
 * @param {string} state
 * @param {string||number} shippingCost
 *
 * returns: string
 */

export function calculateTotal(subtotal, state, shippingCost) {
  subtotal = new Decimal(subtotal);
  const tax = calculateTax(subtotal, state);
  shippingCost = shippingCost || 0;
  return subtotal.plus(tax).plus(shippingCost).toFixed(2);
}
