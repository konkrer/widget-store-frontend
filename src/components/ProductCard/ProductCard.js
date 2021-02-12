import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
} from 'reactstrap';

//local imports
import Pricing1 from '../common/Pricing/Pricing1';
import { getPathRoot } from '../../utils/helpers';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const history = useHistory();
  const locaton = useLocation();

  const gotoProductDetail = id => {
    history.push(`${getPathRoot(locaton.pathname)}/product/${id}`);
  };

  // include product byline if product name is not too long (prevent card overflow)
  const productByline = product.name.length < 31 ? product.byline : '';

  return (
    <Card
      className="ProductCard mb-4 mx-auto"
      onClick={() => gotoProductDetail(product.product_id)}
    >
      <div className="img-wrapper">
        <CardImg
          top
          height="100%"
          width="auto"
          src={product.image_url}
          alt={product.name}
        />
      </div>

      <CardBody>
        <CardTitle tag={product.name.length > 60 ? 'h6' : 'h5'}>
          {product.name}
        </CardTitle>
        <CardSubtitle tag="h6" className="mb-2 text-muted">
          <em>{productByline}</em>
        </CardSubtitle>
        <CardText>
          <Pricing1 product={product} />
        </CardText>
      </CardBody>
    </Card>
  );
};

export default React.memo(ProductCard);
