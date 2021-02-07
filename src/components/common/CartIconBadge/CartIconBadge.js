import { Badge } from 'reactstrap';

// get our fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import './CartIconBadge.css';

const CartIconBadge = ({ numCartItems, className, size = '2x' }) => {
  return (
    <span className={`CartIconBadge position-relative ${className}`}>
      <FontAwesomeIcon icon={faShoppingCart} size={size} />
      {numCartItems > 0 && (
        <Badge className="cart-count-badge badge-pill" color="primary">
          {numCartItems}
          <span className="sr-only">cart items</span>
        </Badge>
      )}
    </span>
  );
};

export default CartIconBadge;
