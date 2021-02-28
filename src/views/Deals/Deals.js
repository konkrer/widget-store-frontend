import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

// local imports
import Navbar from '../../components/Navbar/Navbar';
import ProductPanel from '../../components/ProductPanel/ProductPanel';
import toggleDir from '../../redux/actions/animation/toggleDir';
import StorePageRoutes from '../../routes/storePageRoutes';
import SearchBar from '../../components/SearchBar/SearchBar';
import ProductList from '../../components/ProductList/ProductList';
import pageScrollTopHook from '../../hooks/pageScrollTopHook';
import { getPathRoot } from '../../utils/helpers';
import './Deals.css';

const SpacerDiv = styled.div`
  height: ${p => p.height};
`;

function Deals() {
  const dispatch = useDispatch();
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);
  const slideoutDir = useSelector(state => state.animation.flipFlop);
  // searchbar / productlist filtering
  const initFormState = useRef({ category: 'deals' });
  const [params, setParams] = useState(initFormState.current);

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
        <ProductPanel title={'Deals'} byline={"Here's what's on sale!"}>
          <SearchBar
            setParams={setParams}
            initFormState={initFormState.current}
          />
          <ProductList params={params} />
        </ProductPanel>
        <SpacerDiv height={'100px'} />
      </motion.div>
      {/* End animate page transition. */}

      {/* Nested Routes for product detail, cart, and login. */}
      <StorePageRoutes pathRoot={pathRoot} modalType={1} />
      {/* End Routes. */}
    </>
  );
}

export default Deals;
