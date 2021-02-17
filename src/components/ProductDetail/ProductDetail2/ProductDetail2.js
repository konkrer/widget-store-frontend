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
import ScreenBackground from '../modal/ModalBackground';
import PDModal from '../modal/PDModalCard';
import '../ProductDetail.css';

const ProductDetail2 = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);
  const [modal, setModal] = useState(true);
  const [bgAnimState, setBgAnimState] = useState('fadeIn');
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
    setBgAnimState('fadeOut');
    setTimeout(() => setModal(false), 0);
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
        <ScreenBackground
          onClick={handleClose}
          className={`${bgAnimState} close-modal`}
        >
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
              duration: 0.6,
              type: 'spring',
              ease: 'easeIn',
              delay: 0.1,
            }}
          >
            <PDModal handleClose={handleClose} product={product} />
          </motion.div>
        </ScreenBackground>
      )}
    </AnimatePresence>
  );
};

export default ProductDetail2;
