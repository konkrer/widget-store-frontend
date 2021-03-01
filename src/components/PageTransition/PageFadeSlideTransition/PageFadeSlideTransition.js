/** Page transition framework  view. */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';

// local imports
import Navbar from '../../Navbar/Navbar';
import toggleDir from '../../../redux/actions/animation/toggleDir';
import pageScrollTopHook from '../../../hooks/pageScrollTopHook';

const PageFadeSlideTransition = props => {
  const dispatch = useDispatch();
  const slideoutDir = useSelector(state => state.animation.flipFlop);

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
        {/* Page contents */}
        {props.component || props.children}
        {/* End Page contents */}
      </motion.div>
      {/* End animate page transition. */}
    </>
  );
};

export default PageFadeSlideTransition;
