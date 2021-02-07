import Decimal from 'decimal.js';

const SF_SALES_TAX = new Decimal('0.085');

// calculate discounted price
export function calculateDiscountPrice(product) {
  if (product.discount === '0.00') return product.price;
  const discount = new Decimal(product.discount),
    price = new Decimal(product.price);
  return price.minus(price.times(discount)).toFixed(2);
}

/** Calculate discount as a percent. */
export function calculateDiscountPercent(product) {
  const discount = new Decimal(product.discount);
  return discount.times(100).toFixed(0);
}

/** Return discounted price and discount as a percent */
export function getDiscountData(product) {
  return {
    discountPrice: calculateDiscountPrice(product),
    percent: calculateDiscountPercent(product),
  };
}

/** Calculate tax if customer is in California */
export function calculateTax(subtotal, state) {
  if (!/^ca(lifornia)?$/i.test(state)) return '0.00';
  subtotal = new Decimal(subtotal);
  return subtotal.times(SF_SALES_TAX).toFixed(2);
}

/** Calculate tax plus subtotal plus shipping cost if provided */
export function calculateTotal(subtotal, state, shippingCost) {
  const tax = calculateTax(subtotal, state);
  subtotal = new Decimal(subtotal);
  shippingCost = shippingCost || 0;
  return subtotal.plus(tax).plus(shippingCost).toFixed(2);
}
