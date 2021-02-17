import React from 'react';
import { CardDeck } from 'reactstrap';
import RingLoader from 'react-spinners/RingLoader';

// local imports
import APIRequest from '../../hooks/apiHook';
import ProductCard from '../ProductCard/ProductCard';

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
      <div
        style={{
          height: '100px',
          width: '100px',
          display: 'inline-block',
          marginLeft: '-100px',
        }}
      >
        <RingLoader size={100} color={'blue'} />
        <RingLoader size={100} color={'blue'} />
        <RingLoader size={100} color={'blue'} />
      </div>
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
