import { useState, useCallback } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useSelector, shallowEqual } from 'react-redux';

// local imports
import CustomerInfoForms from './CustomerInfoForms/CustomerInfoForms';
import ShippingForm from './ShippingForm/ShippingForm';
import PaymentForm from './PaymentForm/PaymentForm';
import { motion } from 'framer-motion';
import './CheckoutForms.css';

const CheckoutForms = ({ setDisabled, orderData, setOrderData }) => {
  // state for which step of checkout process is active
  const [step, setStep] = useState(1);
  const [customerCheckmark, setCustomerCheckmark] = useState('default');
  const [shippingCheckmark, setShippingCheckmark] = useState('default');
  const { items, subtotal } = useSelector(
    state => ({
      items: state.cart.items,
      subtotal: state.cart.subtotal,
    }),
    shallowEqual
  );
  // shipping form variables
  const [responseError, setResponseError] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(true);
  const [shippingMethods, setShippingMethods] = useState({});

  const getShippingCosts = useCallback(
    customerData => {
      // if (!customerData) return;
      // fake call to api for shipping costs
      // fake response with shipping costs, etc
      const resp = fakeAPICall(customerData, items);

      /* istanbul ignore next */
      if (resp.error) setResponseError(resp.error.response.data.message);
      else {
        setShippingMethods(resp.data);
        setLoadingShipping(false);
      }
    },
    [items]
  );

  // go to customer info form (step 1)
  /* istanbul ignore next */
  const goTo1 = useCallback(() => {
    setStep(1);
    setDisabled(false);
  }, [setDisabled]);

  // go to shipping (step 2)
  /* istanbul ignore next */
  const goTo2 = useCallback(
    force => {
      // if forcing or shipping does not equal false proceed
      if (force || orderData.shipping !== false) {
        setStep(2);
        // disable cart adjustments
        setDisabled(true);
      }
    },
    [orderData.shipping, setDisabled]
  );

  // go to payment (step 3)
  /* istanbul ignore next */
  const goTo3 = useCallback(
    force => {
      if (!force && !orderData.shipping) return;
      setStep(3);
      // disable cart adjustments
      setDisabled(true);
    },
    [orderData.shipping, setDisabled]
  );

  return (
    <div className="CheckoutForms text-left pt-2 pt-sm-0">
      <Accordion activeKey={`${step}`}>
        <section className="mb-3">
          <Button
            variant="secondary"
            onClick={goTo1}
            className="mb-2 btn-sm py-0 border text-light"
          >
            Customer Information{' '}
            {
              /* Animated checkmark */
              /* istanbul ignore next */
              orderData.customer && orderData.shipping !== false && (
                <motion.div
                  variants={{
                    active: {
                      scale: 7,
                      y: -35,
                      x: 15,
                    },
                    default: {},
                  }}
                  animate={customerCheckmark}
                  transition={{ duration: 0.4 }}
                  className="d-inline-block"
                >
                  <FontAwesomeIcon icon={faCheck} className=" text-success" />
                </motion.div>
              )
            }
            <FontAwesomeIcon icon={faCaretDown} size={'1x'} className="ml-1" />
          </Button>
          <Accordion.Collapse eventKey="1">
            <CustomerInfoForms
              orderData={orderData}
              setOrderData={setOrderData}
              goTo1={goTo1}
              goTo2={goTo2}
              getShippingCosts={getShippingCosts}
              subtotal={subtotal}
              setCustomerCheckmark={setCustomerCheckmark}
            />
          </Accordion.Collapse>
        </section>
        <section className="mb-3">
          <Button
            variant="secondary"
            onClick={/* istanbul ignore next */ () => goTo2()}
            className="mb-2 btn-sm py-0 border text-light"
          >
            Shipping{' '}
            {
              /* Animated checkmark */
              /* istanbul ignore next */
              orderData.shipping && (
                <motion.div
                  variants={{
                    active: {
                      scale: 7,
                      y: -35,
                      x: 15,
                    },
                    default: {},
                  }}
                  animate={shippingCheckmark}
                  transition={{ duration: 0.4 }}
                  className="d-inline-block"
                >
                  <FontAwesomeIcon icon={faCheck} className=" text-success" />
                </motion.div>
              )
            }
            <FontAwesomeIcon icon={faCaretDown} size={'1x'} className="ml-1" />
          </Button>
          <Accordion.Collapse eventKey="2">
            <ShippingForm
              orderData={orderData}
              setOrderData={setOrderData}
              goTo1={goTo1}
              goTo3={goTo3}
              responseError={responseError}
              loadingShipping={loadingShipping}
              shippingMethods={shippingMethods}
              subtotal={subtotal}
              setShippingCheckmark={setShippingCheckmark}
            />
          </Accordion.Collapse>
        </section>
        <section className="mb-3">
          <Button
            variant="secondary"
            onClick={/* istanbul ignore next */ () => goTo3()}
            className="mb-2 btn-sm py-0 border text-light"
          >
            Payment
            <FontAwesomeIcon icon={faCaretDown} size={'1x'} className="ml-1" />
          </Button>
          <Accordion.Collapse eventKey="3">
            {orderData.shipping ? (
              <PaymentForm goTo2={goTo2} orderData={orderData} />
            ) : (
              <Button></Button>
            )}
          </Accordion.Collapse>
        </section>
      </Accordion>
    </div>
  );
};

function fakeAPICall() {
  return FAKE_SHIPPING_RESPONSE;
}

const FAKE_SHIPPING_RESPONSE = {
  data: {
    usps_ground: {
      cost: '12.00',
      name: 'USPS ground shipping (3-7 days)',
    },
    usps_priority: {
      cost: '16.00',
      name: 'USPS priority shipping (2-4 days)',
    },
    usps_next_day: {
      cost: '25.00',
      name: 'USPS next day delivery (1 day)',
    },
    ups_ground: {
      cost: '16.00',
      name: 'UPS ground shipping (3-6 days)',
    },
    ups_2nd_day: {
      cost: '20.00',
      name: 'UPS second day delivery (2 days)',
    },
    ups_overnight: {
      cost: '28.00',
      name: 'UPS overnight delivery (1 day)',
    },
  },
};

export default CheckoutForms;
