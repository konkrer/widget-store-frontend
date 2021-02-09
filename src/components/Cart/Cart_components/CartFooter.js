import { Button } from 'reactstrap';

// local
import PaymentOptions from '../../common/PaymentOptions/PaymentOptions';

const CartFooter = ({ numCartItems, goToCheckout }) => {
  return (
    <>
      <div className="px-4 mt-lg-4">
        <Button
          color="primary"
          className={`w-100 mt-2 text-xl ${numCartItems > 0 ? '' : 'disabled'}`}
          onClick={goToCheckout}
        >
          Proceed to Checkout
        </Button>
      </div>
      <ul className="d-inline-block mb-0">
        <li className="mt-3">Tax and Shipping calculated at checkout.</li>
      </ul>
      <PaymentOptions />
    </>
  );
};

export default CartFooter;
