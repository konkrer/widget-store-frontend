/** Home page view. */

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';

// local imports
import Navbar from '../../components/Navbar/Navbar';
import ProductPanel from '../../components/ProductPanel/ProductPanel';
import toggleDir from '../../redux/actions/animation/toggleDir';
import StorePageRoutes from '../../routes/storePageRoutes';
import ProductList from '../../components/ProductList/ProductList';
import SearchBar from '../../components/SearchBar/SearchBar';
import pageScrollTopHook from '../../hooks/pageScrollTopHook';
import { getPathRoot } from '../../utils/helpers';
import './Home.css';

function Home() {
  const dispatch = useDispatch();
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);
  const slideoutDir = useSelector(state => state.animation.flipFlop);
  // searchbar / productlist filtering
  const [params, setParams] = useState(null);
  const initFormState = useRef({});

  // scroll to top of page with load.
  // needed for mobile behavior.
  pageScrollTopHook();

  // toggle animation direction for page transitions.
  useEffect(() => {
    dispatch(toggleDir());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      {/* Animate page transition. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
          x: `${slideoutDir ? '' : '-'}200vw`,
          opacity: 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <ProductPanel title={'Widget Store'} byline={'We have what you need!'}>
          <SearchBar setParams={setParams} initFormState={initFormState} />
          <ProductList params={params} />
        </ProductPanel>
      </motion.div>
      {/* End animate page transition. */}

      {/* Nested Routes for product detail, cart, and login. */}
      <StorePageRoutes pathRoot={pathRoot} modalType={2} />
      {/* End Routes. */}
    </>
  );
}

export default Home;
