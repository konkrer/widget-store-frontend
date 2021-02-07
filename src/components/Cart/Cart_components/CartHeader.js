// get our fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

// local imports
import CartIconBadge from '../../common/CartIconBadge/CartIconBadge';

const CartHeader = ({ numCartItems, handleClose }) => {
  return (
    <div className="text-left px-4 pt-0 pt-lg-3">
      <button onClick={handleClose} className="btn-noStyle">
        <FontAwesomeIcon icon={faWindowClose} size="2x" />
      </button>
      <span className="text-xxl pl-2 pl-sm-5">Shopping Cart</span>
      <CartIconBadge numCartItems={numCartItems} className="pl-4 pl-lg-5" />
    </div>
  );
};

export default CartHeader;
