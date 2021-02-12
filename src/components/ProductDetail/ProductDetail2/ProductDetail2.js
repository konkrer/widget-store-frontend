/** Product Detail Modal Type 2
 *
 * Shows product details on a custom animated centered modal.
 */

import { useParams, useHistory, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

// local imports
import APIRequest from '../../../hooks/apiHook';
import { getPathRoot } from '../../../utils/helpers';
import toggleDir from '../../../redux/actions/animation/toggleDir';
import ScreenBackground from '../ModalBackground';
import PDModal from '../PDModalCard';
import '../ProductDetail.css';

const ProductDetail2 = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);
  const [modal, setModal] = useState(true);
  const slideoutDir = useSelector(state => state.animation.flipFlop);
  const body = useRef(document.body);

  useEffect(() => {
    // toggle animation direction
    dispatch(toggleDir());
    // add 'modal-open' class to <body> to remove scrolling
    const copy = body.current;
    copy.classList.add('modal-open');

    return () => copy.classList.remove('modal-open');
  }, [dispatch]);

  // close modal function
  const handleClose = e => {
    // only allow elements with class of clode-modal to close modal
    if (!e.target.classList.contains('close-modal')) return;
    setModal(false);
    setTimeout(() => history.push(pathRoot), 500);
  };

  // load product data
  const { loading, error, response } = APIRequest(`/products/${id}`, 'get');

  // if no product found go to path root i.e. /shop, /new, /deals
  if (error) {
    history.replace(pathRoot);
    return null;
  }
  if (loading) return null;

  const product = response.product;

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.94, 0.95, 0.98, 1] }}
          exit={{ opacity: [1, 0.2, 0] }}
          transition={{ type: 'linear', ease: 'easeOut', delay: 0.1 }}
        >
          <ScreenBackground onClick={handleClose} className="close-modal">
            <motion.div
              initial={{
                x: 400 * (slideoutDir ? 1 : -1),
                y: -200,
                scale: 0.35,
                skewX: 9 * (slideoutDir ? 1 : -1) * -1,
                rotateX: '60deg',
                opacity: 0,
              }}
              animate={{
                x: 0,
                y: 0,
                scale: 1,
                skewX: 0,
                rotateX: '0deg',
                opacity: 1,
              }}
              exit={{
                x: 1100 * (slideoutDir ? 1 : -1) * -1,
                y: 0,
                scale: 0.2,
                skewX: 0,
                rotateX: '0deg',
                opacity: 0,
              }}
              transition={{
                duration: 0.8,
                type: 'spring',
                ease: 'easeIn',
                delay: 0.1,
              }}
            >
              <PDModal handleClose={handleClose} product={product} />
            </motion.div>
          </ScreenBackground>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetail2;
