/** Product Detail Modal Type 3
 *
 * Shows product details on a custom animated centered modal which
 * is part of a framer-motion animated shared layout.
 */

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// local imports
import ModalBackground from '../modal/ModalBackground';
import PDModal from '../modal/PDModalCard';
import '../ProductDetail.css';

const ProductDetail3 = ({ selectedId, setSelectedId, disabled }) => {
  const product = useSelector(state => state.cart.items[selectedId]);
  const body = useRef(document.body);

  // remove <body> scrolling hook
  useEffect(() => {
    // add 'modal-open' class to <body> to remove scrolling
    const copy = body.current;
    copy.classList.add('modal-open');

    return () => {
      copy.classList.remove('modal-open');
    };
  }, []);

  // close modal function
  const handleClose = (e, filterTarget) => {
    // only allow elements with class of clode-modal to close modal
    // unless forcing close.
    if (filterTarget && !e.target.classList.contains('close-modal')) return;
    setSelectedId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalBackground
        onClick={e => handleClose(e, true)}
        className="close-modal"
      >
        <motion.div layoutId={selectedId}>
          <PDModal
            handleClose={handleClose}
            product={product}
            disabled={disabled}
          />
        </motion.div>
      </ModalBackground>
    </motion.div>
  );
};

export default ProductDetail3;
