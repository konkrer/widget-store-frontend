/** Product Detail Modal Type 3
 *
 * Shows product details on a custom animated centered modal which
 * is part of a framer-motion animated shared layout.
 */

import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// local imports
import ScreenBackground from '../modal/ModalBackground';
import PDModal from '../modal/PDModalCard';
import '../ProductDetail.css';

const ProductDetail3 = ({ selectedId, setSelectedId, disabled }) => {
  const product = useSelector(state => state.cart.items[selectedId]);

  // close modal function
  const handleClose = e => {
    // only allow elements with class of clode-modal to close modal
    if (!e.target.classList.contains('close-modal')) return;
    setSelectedId(null);
  };

  // const product = cart.items[selectedId];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ScreenBackground onClick={handleClose} className="close-modal">
        <motion.div layoutId={selectedId}>
          <PDModal
            handleClose={handleClose}
            product={product}
            disabled={disabled}
          />
        </motion.div>
      </ScreenBackground>
    </motion.div>
  );
};

export default ProductDetail3;
