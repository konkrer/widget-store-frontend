import React from 'react';
import CardDeck from 'react-bootstrap/CardDeck';

// local imports
import APIRequest from '../../hooks/apiHook';
import ProductCard from '../ProductCard/ProductCard';
import WidgetLoader from '../common/WidgetLoader/WidgetLoader';
import './ProductList.css';

function ProductList({ params }) {
  const { loading, error, response } = APIRequest(
    '/products',
    'get',
    null,
    params
  );

  /* istanbul ignore next */
  if (error) return <div>Error</div>;
  if (loading)
    return (
      <>
        <WidgetLoader />
        <h5 className="text-light">
          <em>Loading...</em>
        </h5>
      </>
    );

  return (
    <CardDeck className="justify-content-center pb-2">
      {response.products.map(product => (
        <ProductCard product={product} key={product.product_id} />
      ))}
    </CardDeck>
  );
}

export default React.memo(ProductList);
