import React from 'react';
import { useLocation } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

//local imports
import Pricing1 from '../common/Pricing/Pricing1';
import { getPathRoot } from '../../utils/helpers';
import { FramerLink } from '../../utils/helpers';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  // const history = useHistory();
  const locaton = useLocation();

  // const gotoProductDetail = id => {
  //   history.push(`${getPathRoot(locaton.pathname)}/product/${id}`);
  // };

  // include product byline if product name is not too long (prevent card overflow)
  const productByline = product.name.length < 31 ? product.byline : '';

  return (
    <FramerLink
      to={`${getPathRoot(locaton.pathname)}/product/${product.product_id}`}
      wrapper_className="mx-auto d-inline-block"
      className="darkLink"
    >
      <Card className="ProductCard mb-3">
        <div className="img-wrapper">
          <Card.Img src={product.image_url} alt={product.name} />
        </div>

        <Card.Body>
          <Card.Title tag={product.name.length > 60 ? 'h6' : 'h5'}>
            {product.name}
          </Card.Title>
          <Card.Subtitle tag="h6" className="mb-2 text-muted">
            <em>{productByline}</em>
          </Card.Subtitle>
          <Card.Text>
            <Pricing1 product={product} />
          </Card.Text>
        </Card.Body>
      </Card>
    </FramerLink>
  );
};

export default React.memo(ProductCard);
