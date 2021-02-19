/** Home page view. */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';

// local imports
import toggleDir from '../../redux/actions/animation/toggleDir';
import Navbar from '../../components/Navbar/Navbar';
import ProductPanel from '../../components/ProductPanel/ProductPanel';
import WidgetLoader from '../../components/common/WidgetLoader/WidgetLoader';
import StorePageRoutes from '../../routes/storePageRoutes';
import { FramerLink, getPathRoot } from '../../utils/helpers';
import Button from 'react-bootstrap/Button';

function CommingSoon() {
  const dispatch = useDispatch();
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);
  const slideoutDir = useSelector(state => state.animation.flipFlop);

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
          title={'Comming Soon'}
          byline={'This page is under construction!'}
        >
          <WidgetLoader />
          <FramerLink to="/shop">
            <Button variant="primary" size="sm" className="mt-4">
              Go Home
            </Button>
          </FramerLink>
        </ProductPanel>
      </motion.div>
      {/* End animate page transition. */}

      {/* Nested Routes for product detail, cart, and login. */}
      <StorePageRoutes pathRoot={pathRoot} modalType={2} />
      {/* End Routes. */}
    </>
  );
}

export default CommingSoon;
