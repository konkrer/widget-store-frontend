import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// local imports
import CartHeader from './Cart_components/CartHeader';
import CartFooter from './Cart_components/CartFooter';
import CartList from '../common/CartList/CartList';
import { getPathRoot } from '../../helpers/helpers';
import './Cart.css';

// background to fade page behind open cart
const ScreenBackground = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right 0;
  background: black;
  z-index: 99;
`;

const SideCart = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0;
  width: 100vw;
  background: var(--light);
  overflow-y: auto;
  z-index: 100;
  border-right: 1px solid var(--secondary);
  border-left: 1px solid var(--secondary);

  @media screen and (min-width: 992px) {
    width: 540px;
  }
`;

function Cart() {
  const history = useHistory();
  const location = useLocation();

  const numCartItems = useSelector(state => state.cart.numCartItems);

  // SideCart animation state
  const [cartAnimationClass, setcartAnimationClass] = useState('animActive');

  const handleClose = () => {
    setcartAnimationClass('animReverse');
    setTimeout(() => history.push(`${getPathRoot(location.pathname)}`), 400);
  };

  // checkout logic function
  const goToCheckout = () => {
    if (numCartItems === 0) return;
    // close side-cart and navigate to checkout
    setcartAnimationClass('animReverse');
    setTimeout(() => history.push('/checkout'), 500);
  };

  return (
    <>
      <ScreenBackground
        onClick={handleClose}
        className={`ScreenBackground ${cartAnimationClass}`}
      />

      <SideCart className={`SideCart ${cartAnimationClass}`}>
        <CartHeader handleClose={handleClose} numCartItems={numCartItems} />

        <CartList />

        {/* ---------- Animate CartFooter ---------- */}
        <motion.div
          variants={{
            animActive: { y: 0, x: 0, opacity: 1 },
            animReverse: { y: 300, x: 1000, opacity: 0 },
          }}
          initial={{ y: 300, x: 1000, opacity: 0 }}
          animate={cartAnimationClass}
          transition={{ type: 'tween', ease: 'easeOut', delay: 0.15 }}
        >
          <CartFooter numCartItems={numCartItems} goToCheckout={goToCheckout} />
        </motion.div>
        {/* ---------- End Animate CartFooter ----------* */}
      </SideCart>
    </>
  );
}

export default Cart;
