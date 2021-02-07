import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { calculateDiscountPrice } from '../../../../helpers/monies';
import { animateVariant } from '../../../../helpers/helpers';
import './CartItem.css';

const CartItem = ({
  item,
  handleIncrement,
  handleDecrement,
  handleRemove,
  className = '',
  disabled,
}) => {
  const [animItemTotal, setAnimItemTotal] = useState(false);
  const price = calculateDiscountPrice(item);
  const itemTotal = new Decimal(price).times(item.quantity).toFixed(2);

  // animation effects
  useEffect(() => {
    animateVariant(setAnimItemTotal, 500);
  }, [item.quantity]);

  return (
    <div className={`CartItem py-4 ${className}`}>
      <Link
        to={`/shop/product/${item.product_id}`}
        className="CartItem-name px-1 font-weight-bold"
      >
        {item.name}
      </Link>
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
              scale: 1.35,
            },
            default: {},
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
