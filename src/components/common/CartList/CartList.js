import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// local imports
import CartItem from './CartItem/CartItem';
import incrementQuantity from '../../../redux/actions/cart/incrementQuantity';
import decrementQuantity from '../../../redux/actions/cart/decrementQuantity';
import removeProduct from '../../../redux/actions/cart/removeProduct';
import { animateVariant } from '../../../utils/helpers';

const CartListDivWrapper = styled.div`
  display: inline-block;
  overflow: hidden;
  border: 1px solid black;
  border-radius: 5px;
  margin-top: 0px;
`;

const CartListDiv = styled.div`
  min-height: ${p => (p.orderData ? '30vh' : '60vh')};
  max-height: 60vh;
  width: 95vw;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${p => (p.numProducts === 1 ? 'white' : 'var(--light)')};
  box-sizing: content-box;

  @media screen and (min-width: 992px) {
    width: 480px;
    height: 60vh;
    max-height: 650px;
  }
`;

const CartListDivHeader = styled.div`
  @media screen and (min-width: 992px) {
    position: sticky;
    top: 0;
  }
`;

const TabulationDiv = styled.div`
  width: 95vw;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  padding-right: 10px;

  @media screen and (min-width: 992px) {
    width: 480px;
  }
`;

const TabulationTable = styled.table`
  border: none;
  font-weight: bold;
  font-size: 18px;

  @media screen and (min-width: 992px) {
    margin-top: 5px;
    margin-right: 15px;
    font-size: 21px;
  }
`;

const CartList = ({ disabled, orderData, setSelectedId }) => {
  const animationTimerSubtotal = useRef(null);
  const animationTimerTax = useRef(null);
  const animationTimerShipping = useRef(null);
  const animationTimerTotal = useRef(null);
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const itemsValues = Object.values(cart.items);

  // animation state
  const [animSubtotal, setAnimSubtotal] = useState(false);
  const [animTax, setAnimTax] = useState(false);
  const [animShipping, setAnimShipping] = useState(false);
  const [animTotal, setAnimTotal] = useState(false);

  // item functions
  const handleIncrement = id => {
    if (disabled) return;
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = id => {
    if (disabled) return;
    dispatch(decrementQuantity(id));
  };

  const handleRemove = id => {
    if (disabled) return;
    dispatch(removeProduct(id));
  };

  // animation effects
  useEffect(() => {
    animationTimerSubtotal.current = animateVariant(setAnimSubtotal, 500);
  }, [cart.subtotal]);

  useEffect(() => {
    animationTimerTax.current = animateVariant(setAnimTax, 500);
  }, [orderData?.tax]);

  useEffect(() => {
    animationTimerShipping.current = animateVariant(setAnimShipping, 500);
  }, [orderData?.shipping?.details?.cost]);

  useEffect(() => {
    animationTimerTotal.current = animateVariant(setAnimTotal, 500);
  }, [orderData?.total]);

  useEffect(() => {
    return () => {
      clearTimeout(animationTimerSubtotal.current);
      clearTimeout(animationTimerTax.current);
      clearTimeout(animationTimerShipping.current);
      clearTimeout(animationTimerTotal.current);
    };
  }, []);

  const animVariants = {
    active: {
      scale: 1.2,
      rotate: [0, 2, -2, 2, -2, 2, -2, 2, -2, 2, -2, 2, -2, 0],
    },
    default: { scale: 1, rotate: 0 },
  };

  return (
    <div>
      <CartListDivWrapper className="">
        <CartListDiv
          orderData={!!orderData}
          className="CartListDiv mx-auto text-dark"
          numProducts={Object.keys(cart.items).length}
        >
          <CartListDivHeader className="border-bottom py-1 bg-secondary text-light">
            <div className="CartItem-name">Item</div>
            <div className="CartItem-price">Price</div>
            <div className="CartItem-quant-adj">Quantity</div>
            <div className="CartItem-total">Item Total</div>
          </CartListDivHeader>
          {itemsValues.map((item, idx) => (
            <CartItem
              item={item}
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
              handleRemove={handleRemove}
              key={item.product_id}
              disabled={disabled}
              setSelectedId={setSelectedId}
            />
          ))}
        </CartListDiv>
      </CartListDivWrapper>
      <TabulationDiv>
        <TabulationTable className="TabulationTable ml-auto">
          <tbody>
            <tr>
              <td className="text-left">Subtotal</td>
              <td className="text-right">
                <motion.div
                  variants={animVariants}
                  animate={animSubtotal}
                  transition={{ ease: 'easeInOut' }}
                >
                  ${cart.subtotal}
                </motion.div>
              </td>
            </tr>
            {orderData && (
              <tr>
                <td className="text-left">Tax</td>
                <td className="text-right">
                  <motion.div
                    variants={animVariants}
                    animate={animTax}
                    transition={{ ease: 'easeInOut' }}
                  >
                    {orderData.tax ? `$${orderData.tax}` : ''}
                  </motion.div>
                </td>
              </tr>
            )}
            {orderData && (
              <tr>
                <td className="text-left">Shipping</td>
                <td className="text-right">
                  <motion.div
                    variants={animVariants}
                    animate={animShipping}
                    transition={{ ease: 'easeInOut' }}
                  >
                    {orderData.shipping?.details?.cost
                      ? `$${orderData.shipping?.details?.cost}`
                      : ''}
                  </motion.div>
                </td>
              </tr>
            )}
            {orderData && (
              <tr className="border-top">
                <td className="text-left">Total</td>
                <td className="text-right">
                  <motion.div
                    variants={animVariants}
                    animate={animTotal}
                    transition={{ ease: 'easeInOut' }}
                  >
                    {orderData.total ? `$${orderData.total}` : ''}
                  </motion.div>
                </td>
              </tr>
            )}
          </tbody>
        </TabulationTable>
      </TabulationDiv>
    </div>
  );
};

export default CartList;
