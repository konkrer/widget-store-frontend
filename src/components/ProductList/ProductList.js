import React from 'react';
import { CardDeck } from 'reactstrap';

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

  if (error) return <div>Error</div>;
  if (loading) return <div>loading...</div>;

  return (
    <CardDeck className="justify-content-center pb-2">
      {response.products.map(product => (
        <ProductCard product={product} key={product.product_id} />
      ))}
    </CardDeck>
  );
}

export default React.memo(ProductList);
