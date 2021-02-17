import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';

// local imports
import Navbar from '../../components/Navbar/Navbar';
import ProductPanel from '../../components/ProductPanel/ProductPanel';
import toggleDir from '../../redux/actions/animation/toggleDir';
import StorePageRoutes from '../../routes/storePageRoutes';
import { getPathRoot } from '../../utils/helpers';

function NewProducts() {
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);
  const slideoutDir = useSelector(state => state.animation.flipFlop);
  const dispatch = useDispatch();

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
          marginLeft: `${slideoutDir ? '' : '-'}200vw`,
          opacity: 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <ProductPanel
          title={'New Products'}
          byline={'Check out our newest items!'}
        />
      </motion.div>
      {/* End animate page transition. */}

      {/* Nested Routes for product detail, cart, and login. */}
      <StorePageRoutes pathRoot={pathRoot} modalType={2} />
      {/* End Routes. */}
    </>
  );
}

export default NewProducts;
