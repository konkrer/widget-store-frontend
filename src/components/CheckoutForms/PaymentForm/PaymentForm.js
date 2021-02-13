import { useState, useEffect, useRef } from 'react';
import { Button, Alert } from 'reactstrap';
import dropin from 'braintree-web-drop-in';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// local imports
import AddressBox from '../AddressBox/AddressBox';
import { asyncAxiosRequest } from '../../../utils/asyncAxiosRequest';
import resetCart from '../../../redux/actions/cart/resetCart';
import './PaymentForm.css';

const PaymentForm = ({ orderData, goTo2 }) => {
  const [paymentSubmitFunction, setPaymentSubmitFunction] = useState(() => {});
  const [responseError, setResponseError] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const cart = useSelector(state => state.cart);
  const numCartItemsRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();

  /**
   * cartChange()
   *
   * Return true if cart has changed from previous state.
   */

  const cartChange = (numCartItemsRef, cart) => {
    // If numCartItemsRef is unset return false
    if (!numCartItemsRef.current) return false;
    return numCartItemsRef.current !== cart.numCartItems;
  };

  // initalize payment dropin element
  useEffect(() => {
    // if useEffect triggered by a cart change return
    // as shipping will have to be recalculated (orderData.total inaccurate)
    // and this PaymentForm component will dismount momentarily once
    // orderData.shipping updates to false on this same cart change
    // in another userEffect call in Checkout.js
    if (cartChange(numCartItemsRef, cart)) return;
    // set ref for numCarItems when this component mounts
    numCartItemsRef.current = cart.numCartItems;

    // pause to allow checkout section animation to complete
    const timerId = setTimeout(() => {
      const payDiv = document.querySelector('#dropin-container');
      if (!payDiv) return;
      payDiv.innerHTML = '';
      // braintree client create and data collection
      dropin
        .create({
          authorization: 'sandbox_v2xjq5kn_v5n25n6c6bn8k3kh',
          container: '#dropin-container',
          paypal: {
            flow: 'checkout',
            amount: orderData.total,
            currency: 'USD',
          },
        })
        .then(instance => {
          setPaymentSubmitFunction(() => () => {
            setBtnDisabled(true);
            instance.requestPaymentMethod(
              async (requestPaymentMethodErr, payload) => {
                if (requestPaymentMethodErr) {
                  const errorMsg =
                    requestPaymentMethodErr.message ===
                    'No payment method is available.'
                      ? 'Please provide payment information'
                      : requestPaymentMethodErr.message;
                  setResponseError(errorMsg);
                  return console.log(requestPaymentMethodErr);
                }
                const data = {
                  cart,
                  orderData,
                  nonce: payload.nonce,
                };
                // create order on backend server
                const resp = await asyncAxiosRequest('/orders', 'post', data);
                if (resp.error) {
                  return setResponseError(resp.error.response.data.message);
                }
                dispatch(resetCart());
                history.replace(`/order-success/${resp.data.order.order_id}`);
              }
            );
          });
        })
        .catch(err => {
          console.error(err);
        });
      return () => clearTimeout(timerId);
    }, 900);
  }, [orderData, cart, history, dispatch]);

  return (
    <>
      <div className="d-flex align-items-start flex-wrap">
        <AddressBox title={'Customer Info'} customer={orderData.customer} />
        <AddressBox
          title={'Shipping Address'}
          customer={orderData.shippingAddress || orderData.customer}
          isShippingAddress="true"
        />
        <AddressBox
          title={'Shipping Method'}
          isTextBox="true"
          text={`$${orderData.shipping?.details.cost} - ${orderData.shipping?.details.name}`}
        />

        <Button
          color="secondary"
          onClick={goTo2}
          className="mt-4 mt-sm-0 mt-md-4"
        >
          Back to Shipping
        </Button>
      </div>

      <div
        id="dropin-container"
        className="mt-2"
        onClick={() => setBtnDisabled(false)}
      ></div>

      {responseError && btnDisabled && (
        <Alert color="danger" className="mt-2">
          {responseError}
        </Alert>
      )}

      <Button
        color="primary"
        size="lg"
        className="form-control my-3 rounded-pill"
        onClick={paymentSubmitFunction}
        disabled={btnDisabled}
      >
        Place Order
      </Button>
      <h5 className="text-center">Total: ${orderData.total}</h5>
    </>
  );
};

export default PaymentForm;
