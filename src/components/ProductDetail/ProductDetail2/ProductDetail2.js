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
import ModalBackground from '../modal/ModalBackground';
import WidgetLoader from '../../common/WidgetLoader/WidgetLoader';
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
    // add 'modal-open' class to <body> to remove scrolling
    const copy = body.current;
    copy.classList.add('modal-open');

    return () => {
      copy.classList.remove('modal-open');
      // toggle animation direction
      dispatch(toggleDir());
    };
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
  let { loading, error, response } = APIRequest(`/products/${id}`, 'get');

  // if no product found go to path root i.e. /shop, /new, /deals
  if (error) {
    history.replace(pathRoot);
    return null;
  }

  /* If loading return spinner else Product Detail Modal */
  const modalContent = loading ? (
    <WidgetLoader />
  ) : (
    <PDModal handleClose={handleClose} product={response.product} />
  );

  return (
    <AnimatePresence>
      {modal && (
        <ModalBackground
          onClick={handleClose}
          className={`${bgAnimState} close-modal`}
        >
          <motion.div
            initial={{
              x: 400 * (slideoutDir ? 1 : -1),
              y: -200,
              scale: 0.01,
              skewX: 9 * (slideoutDir ? 1 : -1) * -1,
              rotateX: '-60deg',
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
              x: -400 * (slideoutDir ? 1 : -1),
              y: -200,
              scale: 0.01,
              skewX: 9 * (slideoutDir ? 1 : -1),
              rotateX: '-60deg',
              opacity: 0,
            }}
            transition={{
              duration: 0.7,
              type: 'spring',
              ease: 'easeIn',
              delay: 0.1,
            }}
          >
            {modalContent}
          </motion.div>
        </ModalBackground>
      )}
    </AnimatePresence>
  );
};

export default ProductDetail2;
