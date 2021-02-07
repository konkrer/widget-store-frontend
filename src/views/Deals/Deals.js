import { useMemo } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// local imports
import Navbar from '../../components/Navbar/Navbar';
import ProductList from '../../components/ProductList/ProductList';
import ProductDetail from '../../components/ProductDetail/ProductDetail';
import LoginSignup from '../../components/LoginSignup/LoginSignup';
import { getPathRoot } from '../../helpers/helpers';
import Cart from '../../components/Cart/Cart';
import './Deals.css';

function Deals() {
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);

  const slideoutDir = useMemo(() => {
    // return a random '-' neg sign or an empty string ''
    return Math.floor(Math.random() * 2) ? '-' : '';
  }, []);

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
          marginLeft: `${slideoutDir}200vw`,
          opacity: 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="container my-4 py-3 Deals dark-gradient1 rounded">
          <h1 className="brand-style">Deals</h1>
          <h2 className="lead font-italic mb-4 Home-byline">
            Here's what's on sale!
          </h2>
          <ProductList />
        </div>
      </motion.div>

      <Route exact path={`${pathRoot}/product/:id`}>
        <ProductDetail />
      </Route>
      <Route path={`${pathRoot}/cart`}>
        <Cart />
      </Route>
      <Route path={`${pathRoot}/login`}>
        <LoginSignup />
      </Route>
    </>
  );
}

export default Deals;
