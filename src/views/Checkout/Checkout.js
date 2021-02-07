import { Container, Row, Col } from 'reactstrap';
import { Route, useHistory } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// get our fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

// local imports
import Navbar from '../../components/Navbar/Navbar';
import LoginSignup from '../../components/LoginSignup/LoginSignup';
import ItemsList from '../../components/common/ItemsList/ItemsList';
import CheckoutForms from '../../components/CheckoutForms/CheckoutForms';
import { calculateTax, calculateTotal } from '../../helpers/monies';
import './Checkout.css';

const Checkout = () => {
  // composite order data for checkout steps
  const [orderData, setOrderData] = useState({});
  // disabled flag for disabling itemsList cart adjustment
  const [disabled, setDisabled] = useState(false);
  const cart = useSelector(state => state.cart, shallowEqual);
  const history = useHistory();

  // When cart state changes...
  //
  // Recalculate tax and total based on the changed cart data.
  // Set orderData.shipping to false to disallow navigating to shipping step
  // to force a shipping cost recalculation.
  useEffect(() => {
    setOrderData(orderData => ({
      ...orderData,
      shipping: false,
      // if customer data calculate tax else return 0
      tax: orderData.customer
        ? calculateTax(cart.subtotal, orderData.customer?.state)
        : 0,
      total: calculateTotal(cart.subtotal, orderData.customer?.state),
    }));
  }, [cart]);

  const handleClose = () => {
    history.goBack();
  };

  return (
    <div className="Checkout text-light">
      <Navbar />
      <motion.div
        initial={{ marginTop: '-100vh', opacity: 0 }}
        animate={{ marginTop: '0vh', opacity: 1 }}
        exit={{ marginTop: '100vh', opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container
          fluid="xl"
          className="dark-gradient1 my-4 px-0 pt-3 rounded position-relative"
        >
          <div className="Panel-close">
            <button className="btn-noStyle" onClick={handleClose}>
              <FontAwesomeIcon icon={faWindowClose} size={'2x'} />
            </button>
          </div>
          <h1>Checkout</h1>
          <Row className="mx-0">
            <Col xs="12" lg="6" className="py-2 py-lg-3 cart-col px-0">
              <ItemsList disabled={disabled} orderData={orderData} />
            </Col>
            <Col xs="12" lg="6" className="px-3 px-sm-4 py-lg-3">
              <CheckoutForms
                setDisabled={setDisabled}
                orderData={orderData}
                setOrderData={setOrderData}
              />
            </Col>
          </Row>
        </Container>
      </motion.div>

      <Route path={`/checkout/login`}>
        <LoginSignup />
      </Route>
    </div>
  );
};

export default Checkout;
