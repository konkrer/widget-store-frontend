import { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'reactstrap';

// local imports
import Navbar from '../../components/Navbar/Navbar';
import ProductList from '../../components/ProductList/ProductList';
import ProductDetail from '../../components/ProductDetail/ProductDetail2/ProductDetail2';
import LoginSignup from '../../components/LoginSignup/LoginSignup';
import { getPathRoot } from '../../utils/helpers';
import Cart from '../../components/Cart/Cart';
import toggleDir from '../../redux/actions/animation/toggleDir';
import './Home.css';

function Home() {
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);
  const slideoutDir = useSelector(state => state.animation.flipFlop);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleDir());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
          marginLeft: `${slideoutDir ? '' : '-'}200vw`,
          opacity: 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <Container
          className="my-4 py-4 Home dark-gradient1 rounded px-2 px-xl-5"
          fluid="xl"
        >
          <h1 className="brand-style">Widget Store</h1>
          <h2 className="lead font-italic mb-4 Home-byline">
            We have what you need!
          </h2>
          <ProductList />
        </Container>
      </motion.div>

      <Route exact path={`${pathRoot}/product/:id`}>
        <ProductDetail />
      </Route>
      <Route exact path={`${pathRoot}/cart`}>
        <Cart />
      </Route>
      <Route exact path={`${pathRoot}/login`}>
        <LoginSignup />
      </Route>
    </>
  );
}

export default Home;
