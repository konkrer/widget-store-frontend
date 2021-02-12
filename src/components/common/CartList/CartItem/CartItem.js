import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from 'reactstrap';
import Decimal from 'decimal.js';
import { motion } from 'framer-motion';

// get our fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusSquare,
  faMinusSquare,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

// local imports
import { calculateDiscountPrice } from '../../../../utils/monies';
import { animateVariant, getPathRoot } from '../../../../utils/helpers';
import './CartItem.css';

const CartItem = ({
  item,
  handleIncrement,
  handleDecrement,
  handleRemove,
  className = '',
  disabled,
  setSelectedId,
}) => {
  const price = calculateDiscountPrice(item);
  const itemTotal = new Decimal(price).times(item.quantity).toFixed(2);
  const location = useLocation();
  const pathRoot = getPathRoot(location.pathname);

  // animation effects based on item quantity
  const [animItemTotal, setAnimItemTotal] = useState(false);
  const animationTimer = useRef(null);
  useEffect(() => {
    animationTimer.current = animateVariant(setAnimItemTotal, 500);
  }, [item.quantity]);

  // clear timer
  useEffect(() => clearTimeout(animationTimer.current), []);

  /** The product name in the CartItem will open a product detail modal.
   * Return either a link to the product url or a button to set state
   * for the shared layout animation.
   */
  const productNameLink = (setSelectedId => {
    // if part of shared layout name button sets selected ID
    if (setSelectedId)
      return (
        <motion.button
          className="btn-noStyle CartItem-name"
          onClick={() => setSelectedId(item.product_id)}
          layoutId={item.product_id}
        >
          {item.name}
        </motion.button>
      );

    // else link links to product page
    return (
      <Link
        to={`${pathRoot}/product/${item.product_id}`}
        className="CartItem-name"
      >
        {item.name}
      </Link>
    );
  })(setSelectedId);

  return (
    <div className={`CartItem py-4 ${className}`}>
      {productNameLink}
      <div className="CartItem-price">${price}</div>
      <div className="CartItem-quant-adj pt-4 pt-sm-0">
        <Badge
          className="mr-2 border quantDisplay"
          color="light"
          data-testid={'quantDisplay'}
        >
          {item.quantity}
        </Badge>
        <button
          className={`btn-noStyle text-info increment ${
            disabled ? 'disabled' : ''
          }`}
          aria-label="increment button"
          onClick={() => handleIncrement(item.product_id)}
        >
          <FontAwesomeIcon icon={faPlusSquare} size="1x" />
        </button>
        <button
          className={`btn-noStyle text-secondary ${disabled ? 'disabled' : ''}`}
          aria-label="decrement button"
          onClick={() => handleDecrement(item.product_id)}
        >
          <FontAwesomeIcon icon={faMinusSquare} size="1x" />
        </button>
        <button
          className={`btn-noStyle text-dark ml-2 ${disabled ? 'disabled' : ''}`}
          aria-label="remove button"
          onClick={() => handleRemove(item.product_id)}
        >
          <FontAwesomeIcon icon={faTrashAlt} size="1x" />
        </button>
      </div>

      <div className="CartItem-total font-weight-bold">
        <motion.div
          variants={{
            active: {
              scale: 1.2,
            },
            default: { scale: 1 },
          }}
          animate={animItemTotal}
          transition={{ ease: 'easeInOut' }}
        >
          ${itemTotal}
        </motion.div>
      </div>
    </div>
  );
};

export default CartItem;
