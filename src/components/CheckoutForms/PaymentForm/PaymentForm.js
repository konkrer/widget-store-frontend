import { useState, useEffect, useCallback } from 'react';
import { Button, Alert } from 'react-bootstrap';
import dropin from 'braintree-web-drop-in';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// local imports
import AddressBox from '../AddressBox/AddressBox';
import { asyncAxiosRequest } from '../../../utils/asyncAxiosRequest';
import resetCart from '../../../redux/actions/cart/resetCart';
import './PaymentForm.css';

const PaymentForm = ({ orderData, goTo2 }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  // state
  const [paymentSubmitFunction, setPaymentSubmitFunction] = useState(() => {});
  const [responseError, setResponseError] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const cart = useSelector(state => state.cart);

  const dropinInit = useCallback(() => {
    // empty payDiv in case dropin already present (i.e. shipping method change)
    const payDiv = document.querySelector('#dropin-container');
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
                return setResponseError(errorMsg);
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
              // clear cart and go to order success page.
              dispatch(resetCart());
              history.replace(`/order-success/${resp.data.order.order_id}`);
            }
          );
        });
      })
      .catch(err => {
        setResponseError(err.message);
      });
  }, [cart, orderData, dispatch, history]);

  // initalize payment dropin element
  useEffect(() => {
    // pause to allow checkout section animation to complete
    // before dropin initialization.
    const timerId = setTimeout(dropinInit, 900);

    // clear dropin mount delay timer
    return () => clearTimeout(timerId);
  }, [dropinInit]);

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
          variant="secondary"
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
        data-testid={'dropin-container'}
      ></div>

      {responseError && btnDisabled && (
        <Alert variant="danger" className="mt-2" aria-label={'error'}>
          {responseError}
        </Alert>
      )}

      <Button
        variant="primary"
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
