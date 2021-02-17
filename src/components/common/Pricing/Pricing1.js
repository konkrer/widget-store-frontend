/** Utility component to show Product price.
 *
 * If there is a discount it will show original price
 * with a strikethrough and provide a sale byline
 * showing the percent off.
 */

import styled from 'styled-components';

// local imports
import { getDiscountData } from '../../../utils/moneyFuncts';

// styled components:

// strike through original price if product has been discounted.
const PriceStrikethrough = styled.span`
  text-decoration: ${props => (props.discount > 0 ? 'line-through' : 'none')};
  color: red;
`;
// make price dark unless struck-through
const Price = styled.span`
  color: ${props => (props.discount > 0 ? 'var(--secondary)' : 'var(--dark)')};
  font-weight: ${props => (props.discount > 0 ? 'normal' : 'bold')};
`;
// sale byline span
const SaleByline = styled.span`
  display: block;
  color: var(--success);
  font-weight: bold;
  font-style: italic;
`;
// discounted price span
const DiscountedPriceSpan = styled.span`
  color: var(--dark);
  font-weight: bold;
  font-style: italic;
  background: var(--warning);
  border-radius: 5px;
`;

const Pricing1 = ({ product }) => {
  // if there is a discount create sale byline and discounted price span
  if (product.discount > 0) {
    const { discountPrice, percent } = getDiscountData(product);

    var saleByline = (
      <SaleByline className="mb-1">Sale {percent}% OFF</SaleByline>
    );
    // create discounted price span
    var discountPriceSpan = (
      <DiscountedPriceSpan className="ml-2 p-1">
        ${discountPrice}
      </DiscountedPriceSpan>
    );
  }

  return (
    <>
      {saleByline}
      <PriceStrikethrough discount={product.discount}>
        <Price discount={product.discount} className="price">
          ${product.price}
        </Price>
      </PriceStrikethrough>
      {discountPriceSpan}
    </>
  );
};

export default Pricing1;
